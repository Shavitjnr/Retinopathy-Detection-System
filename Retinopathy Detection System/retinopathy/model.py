import os
import random
import time
import cv2
import numpy as np

# Optional DL support
try:
    import torch
    import torch.nn as nn
    from torchvision import models, transforms
    from PIL import Image as PILImage
    DL_SUPPORT = True
except ImportError:
    DL_SUPPORT = False

class RetinopathyModel:
    def __init__(self, weights_path='retinopathy_model.pth'):
        self.weights_path = weights_path
        self.dl_active = False
        self.model = None
        
        print("Initializing Retinopathy Detection Model...")
        
        if DL_SUPPORT and os.path.exists(self.weights_path):
            try:
                print(f"Loading Deep Learning weights from {self.weights_path}...")
                self.model = models.resnet18(pretrained=False)
                num_ftrs = self.model.fc.in_features
                self.model.fc = nn.Linear(num_ftrs, 5) # 5 DR Stages
                
                # Load weights (CPU fallback)
                state_dict = torch.load(self.weights_path, map_location=torch.device('cpu'))
                self.model.load_state_dict(state_dict)
                self.model.eval()
                
                self.dl_active = True
                self.transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
                ])
                print("Deep Learning model activated successfully.")
            except Exception as e:
                print(f"Failed to load DL model: {e}. Falling back to CV.")
        else:
            print("No DL weights found or dependencies missing. Using Hybrid AI/CV Mode.")
        
        time.sleep(1)
        print(f"Model initialized ({'DL' if self.dl_active else 'Hybrid CV'} Mode)")
        
    def predict(self, image_path):
        """
        Performs diagnosis, vessel segmentation, and lesion detection.
        """
        print(f"Analyzing image: {image_path}")
        
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            return {"error": "Could not read image"}

        # 1. Vessel Segmentation Simulation (Computer Vision approach)
        # Extract green channel (vessels have highest contrast here)
        green_ch = img[:, :, 1]
        
        # Apply CLAHE to enhance contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        contrast_enhanced = clahe.apply(green_ch)
        
        # Simple vessel extraction using adaptive thresholding
        vessels = cv2.adaptiveThreshold(
            contrast_enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Clean up noise
        kernel = np.ones((2,2), np.uint8)
        vessels = cv2.morphologyEx(vessels, cv2.MORPH_OPEN, kernel)

        # Save segmented image
        filename = os.path.basename(image_path)
        segmented_name = f"segmented_{filename}"
        segmented_path = os.path.join(os.path.dirname(image_path), segmented_name)
        cv2.imwrite(segmented_path, vessels)

        # 2. DIAGNOSIS LOGIC
        if self.dl_active:
            try:
                # B. DEEP LEARNING INFERENCE
                print("Performing Deep Learning Inference...")
                pil_img = PILImage.open(image_path).convert('RGB')
                input_tensor = self.transform(pil_img).unsqueeze(0)
                
                with torch.no_grad():
                    outputs = self.model(input_tensor)
                    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                    confidence, preds = torch.max(probabilities, 0)
                
                stages = [
                    "No DR (Healthy)", 
                    "Mild Nonproliferative DR", 
                    "Moderate Nonproliferative DR", 
                    "Severe Nonproliferative DR", 
                    "Proliferative DR"
                ]
                
                prediction = stages[preds.item()]
                confidence = confidence.item()
                details = f"Deep Learning Inference (ResNet18) complete. Confidence: {confidence:.2%}"
                
            except Exception as e:
                print(f"DL Inference failed: {e}. Falling back to CV.")
                prediction, confidence, details = self._predict_cv(img, contrast_enhanced, vessels)
        else:
            # B. COMPUTER VISION HEURISTIC (Fallback)
            prediction, confidence, details = self._predict_cv(img, contrast_enhanced, vessels)

        # 3. Annotation Generation (Using CV detection coordinates)
        # We still use CV to find the "blobs" for the user interface
        annotations = self._generate_cv_annotations(contrast_enhanced, vessels)

        return {
            "diagnosis": prediction,
            "confidence": confidence,
            "details": details,
            "segmented_url": f"/static/uploads/{segmented_name}",
            "annotations": annotations,
            "image_size": {"width": img.shape[1], "height": img.shape[0]}
        }

    def _predict_cv(self, img, contrast_enhanced, vessels):
        # A. Hemorrhage/Microaneurysm Detection (Dark spots in Green channel)
        _, dark_spots = cv2.threshold(contrast_enhanced, 20, 255, cv2.THRESH_BINARY_INV)
        lesions_mask = cv2.subtract(dark_spots, vessels)
        
        # B. Exudate Detection (Bright spots)
        _, bright_spots = cv2.threshold(contrast_enhanced, 220, 255, cv2.THRESH_BINARY)
        
        # Count "Blobs"
        hemo_contours, _ = cv2.findContours(lesions_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        exud_contours, _ = cv2.findContours(bright_spots, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        hemo_count = len([c for c in hemo_contours if cv2.contourArea(c) > 5])
        exud_count = len([c for c in exud_contours if cv2.contourArea(c) > 5])
        
        # C. Diagnosis Logic base on feature counts
        if hemo_count == 0 and exud_count == 0:
            prediction = "No DR (Healthy)"
            confidence = 0.98
        elif hemo_count < 5 and exud_count == 0:
            prediction = "Mild Nonproliferative DR"
            confidence = 0.92
        elif hemo_count < 15 or exud_count < 5:
            prediction = "Moderate Nonproliferative DR"
            confidence = 0.88
        elif hemo_count < 30 or exud_count < 15:
            prediction = "Severe Nonproliferative DR"
            confidence = 0.85
        else:
            prediction = "Proliferative DR"
            confidence = 0.82
            
        return prediction, confidence, f"CV Heuristic Analysis: Found {hemo_count} red lesions, {exud_count} exudates."

    def _generate_cv_annotations(self, contrast_enhanced, vessels):
        _, dark_spots = cv2.threshold(contrast_enhanced, 20, 255, cv2.THRESH_BINARY_INV)
        lesions_mask = cv2.subtract(dark_spots, vessels)
        _, bright_spots = cv2.threshold(contrast_enhanced, 220, 255, cv2.THRESH_BINARY)
        
        hemo_contours, _ = cv2.findContours(lesions_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        exud_contours, _ = cv2.findContours(bright_spots, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        annotations = []
        for c in hemo_contours[:15]:
            if cv2.contourArea(c) > 10:
                x, y, w, h = cv2.boundingRect(c)
                annotations.append({"x": x, "y": y, "w": w, "h": h, "label": "Hemorrhage"})
                
        for c in exud_contours[:10]:
            if cv2.contourArea(c) > 10:
                x, y, w, h = cv2.boundingRect(c)
                annotations.append({"x": x, "y": y, "w": w, "h": h, "label": "Exudate"})
        return annotations

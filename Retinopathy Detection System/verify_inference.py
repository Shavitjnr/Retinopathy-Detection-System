from retinopathy.model import RetinopathyModel
import glob
import os

def test_inference():
    print("--- Clinical Inference Verification ---")
    model = RetinopathyModel('retinopathy_model.pth')
    
    # Grab a few images from the archive
    test_images = glob.glob('archive/colored_images/*/*.png')[:5]
    
    if not test_images:
        print("No archive images found to test.")
        return

    for img_path in test_images:
        print(f"\nTesting: {img_path}")
        result = model.predict(img_path)
        if "error" in result:
            print(f"FAILED: {result['error']}")
        else:
            print(f"SUCCESS!")
            print(f"Diagnosis: {result['diagnosis']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print(f"Details: {result['details']}")

if __name__ == "__main__":
    test_inference()

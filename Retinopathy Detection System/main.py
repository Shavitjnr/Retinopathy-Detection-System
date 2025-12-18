
import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Configuration
DATA_PATH = 'diabetes.csv'
MODEL_DIR = os.path.join('Two classes', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'diabetes_model.pkl')

os.makedirs(MODEL_DIR, exist_ok=True)

def create_mock_data():
    """Creates a synthetic PIMA Diabetes dataset with realistic distributions."""
    print("Dataset not found. Generating synthetic PIMA-like data...")
    np.random.seed(42)
    n_samples = 768
    
    # Generate balanced features with some correlation to outcome
    # Lower glucose/BMI = lower risk
    outcome = np.random.choice([0, 1], size=n_samples, p=[0.65, 0.35])
    
    glucose = np.where(outcome == 1, 
                       np.random.normal(140, 30, n_samples), 
                       np.random.normal(100, 20, n_samples))
    
    bmi = np.where(outcome == 1, 
                   np.random.normal(35, 5, n_samples), 
                   np.random.normal(26, 4, n_samples))
    
    age = np.random.randint(21, 81, n_samples)
    pregnancies = np.random.randint(0, 17, n_samples)
    
    # Simple constraints
    glucose = np.clip(glucose, 44, 199)
    bmi = np.clip(bmi, 18, 67)
    
    data = {
        'Pregnancies': pregnancies,
        'Glucose': glucose,
        'BloodPressure': np.random.normal(69, 19, n_samples),
        'SkinThickness': np.random.randint(0, 99, n_samples),
        'Insulin': np.random.randint(0, 846, n_samples),
        'BMI': bmi,
        'DiabetesPedigreeFunction': np.random.uniform(0.078, 2.42, n_samples),
        'Age': age,
        'Outcome': outcome
    }
    
    df = pd.DataFrame(data)
    df.to_csv(DATA_PATH, index=False)
    print(f"Synthetic data saved to {DATA_PATH}")
    return df

def train_model():
    """Loads data, trains a model, and saves it."""
    if not os.path.exists(DATA_PATH):
        df = create_mock_data()
    else:
        print(f"Loading data from {DATA_PATH}...")
        df = pd.read_csv(DATA_PATH)
    
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model trained. Accuracy: {accuracy:.2f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    return model

def predict_diabetes(model):
    """Interactive prediction."""
    print("\n--- Health AI Assistant: Diabetes Risk Predictor ---")
    print("Please enter the following patient details:")
    
    try:
        pregnancies = float(input("Pregnancies (e.g., 6): "))
        glucose = float(input("Glucose (e.g., 148): "))
        bp = float(input("Blood Pressure (e.g., 72): "))
        skin = float(input("Skin Thickness (e.g., 35): "))
        insulin = float(input("Insulin (e.g., 0): "))
        bmi = float(input("BMI (e.g., 33.6): "))
        dpf = float(input("Diabetes Pedigree Function (e.g., 0.627): "))
        age = float(input("Age (e.g., 50): "))
        
        features = [[pregnancies, glucose, bp, skin, insulin, bmi, dpf, age]]
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        
        print("\n--- Result ---")
        if prediction == 1:
            print(f"WARNING: High risk of diabetes detected. (Confidence: {probability:.2%})")
        else:
            print(f"Low risk of diabetes detected. (Confidence: {1-probability:.2%})")
            
    except ValueError:
        print("Invalid input. Please enter numeric values.")

def main():
    if not os.path.exists(MODEL_PATH):
        print("No trained model found. Starting training process...")
        model = train_model()
    else:
        print(f"Loading existing model from {MODEL_PATH}...")
        model = joblib.load(MODEL_PATH)
    
    while True:
        choice = input("\nWould you like to (1) Train new model, (2) Predict Risk, or (q) Quit? ").lower()
        if choice == '1':
            model = train_model()
        elif choice == '2':
            predict_diabetes(model)
        elif choice == 'q':
            print("Exiting Health AI Assistant. Stay healthy!")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()

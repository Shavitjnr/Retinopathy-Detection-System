
import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Import the mock model
from retinopathy.model import RetinopathyModel

app = Flask(__name__)
app.secret_key = 'super_secret_health_ai_key'  # Change this for production
CORS(app) # Enable CORS for Next.js frontend communication

# Configuration
MODEL_PATH = os.path.join('Two classes', 'models', 'diabetes_model.pkl')
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load Diabetes Model
try:
    model = joblib.load(MODEL_PATH)
    print("Diabetes Model loaded successfully.")
except Exception as e:
    print(f"Error loading Diabetes model: {e}")
    model = None

# Initialize Retinopathy Model
retinopathy_model = RetinopathyModel()

import csv

USER_DB = 'users.csv'

def init_db():
    if not os.path.exists(USER_DB):
        with open(USER_DB, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['name', 'dob', 'password'])

init_db()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    dob = data.get('dob')
    password = data.get('password')

    if not name or not dob or not password:
        return jsonify({'error': 'Missing fields'}), 400

    users = []
    with open(USER_DB, 'r', newline='') as f:
        reader = csv.DictReader(f)
        users = list(reader)

    # Check if user exists (simple check by name)
    for user in users:
        if user['name'] == name:
             return jsonify({'error': 'User already exists'}), 409

    with open(USER_DB, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([name, dob, password])

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')
    password = data.get('password')

    with open(USER_DB, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for user in reader:
            if user['name'] == name and user['password'] == password:
                return jsonify({'message': 'Login successful', 'user': {'name': name, 'dob': user['dob']}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    name = data.get('name')
    dob = data.get('dob')
    new_password = data.get('new_password')

    if not name or not dob or not new_password:
        return jsonify({'error': 'Missing fields'}), 400

    users = []
    updated = False
    with open(USER_DB, 'r', newline='') as f:
        reader = csv.DictReader(f)
        users = list(reader)

    for user in users:
        if user['name'] == name and user['dob'] == dob:
            user['password'] = new_password
            updated = True
            break
    
    if updated:
        with open(USER_DB, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['name', 'dob', 'password'])
            for user in users:
                writer.writerow([user['name'], user['dob'], user['password']])
        return jsonify({'message': 'Password reset successful'}), 200
    else:
        return jsonify({'error': 'User not found or DOB incorrect'}), 404

@app.route('/')
def home():
    return "Health AI API is running."


@app.route('/api/predict', methods=['POST'])
def predict():
    # Note: Disabled login_required for API to allow Next.js easy access for demo
    if not model:
        return jsonify({'error': 'Model not loaded. Please train the model using main.py first.'}), 500

    try:
        data = request.json
        # Extract features in the correct order
        features = [
            float(data.get('pregnancies', 0)),
            float(data.get('glucose', 0)),
            float(data.get('bp', 0)),
            float(data.get('skin', 0)),
            float(data.get('insulin', 0)),
            float(data.get('bmi', 0)),
            float(data.get('dpf', 0)),
            float(data.get('age', 0))
        ]
        
        prediction = model.predict([features])[0]
        probability = model.predict_proba([features])[0][1]
        
        result = {
            'prediction': int(prediction),
            'probability': float(probability),
            'risk_level': 'High' if prediction == 1 else 'Low'
        }
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/retinopathy/predict', methods=['POST'])
def predict_retinopathy():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Run prediction using mockup model
        result = retinopathy_model.predict(filepath)
        result['image_url'] = f'/static/uploads/{filename}'
        
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

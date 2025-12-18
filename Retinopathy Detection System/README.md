# Health AI Assistant - Diabetes Risk Predictor

## Overview

This project is a Python-based Health AI Assistant capable of predicting the risk of diabetes based on the PIMA Indians Diabetes dataset parameters.

It features both a **Command Line Interface (CLI)** and a **Web Application**.

## Features

- **Web Dashboard**: A beautiful, glassmorphism-styled web interface for easy interaction.
- **Login System**: Secure access (Default: `admin` / `admin`).
- **Real-time Analysis**: Instant feedback on diabetes risk with confidence scores.
- **Synthetic Data**: Automatic data generation if the original dataset is missing.
- **Model Persistence**: Saves trained models for reuse.

## Installation

1.  **Install Dependencies**:
    ```bash
    pip install flask pandas numpy scikit-learn joblib
    ```

## Usage

### Option 1: Run the Web App (Recommended)

This launches the full graphical interface.

```bash
python app.py
```

- Open your browser and search `http://127.0.0.1:5000`
- **Login**: Username: `admin`, Password: `admin`

### Option 2: Run the CLI Tool

This runs the text-based training and prediction tool.

```bash
python main.py
```

## File Structure

- `app.py`: The Flask Web Application.
- `main.py`: CLI Tool and Model Trainer.
- `templates/`: HTML files for the web app.
- `static/`: CSS and JavaScript files.
- `Two classes/models/`: Stored machine learning models.

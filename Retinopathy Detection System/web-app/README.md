# Dr. Retina AI - Health Assistant Platform

A comprehensive health diagnostic and assistance platform combining advanced Machine Learning models with Generative AI to provide early detection of **Diabetic Retinopathy** and **Diabetes Risk Assessment**.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Python (Flask)**.

---

## 🚀 Features

### 1. 👁️ Retinopathy AI Scanner

- **Deep Learning Analysis**: Uses a Convolutional Neural Network (CNN) trained on thousands of fundus images.
- **Instant Diagnosis**: Upload a retinal image to detect signs of Diabetic Retinopathy (DR) or confirm a healthy retina.
- **Visual Feedback**: Displays diagnosis with confidence scores and color-coded alerts (Green for Healthy, Red for DR).

### 2. 📊 Diabetes Risk Assessment

- **Predictive Modeling**: Uses the PIMA Indian Diabetes Dataset model to assess diabetes risk based on clinical parameters.
- **Comprehensive Inputs**: Analyzes:
  - Pregnancies
  - Glucose Level
  - Blood Pressure
  - Skin Thickness
  - Insulin Level
  - BMI
  - Diabetes Pedigree Function
  - Age
- **Risk Probability**: Provides a precise percentage probability of diabetes risk.

### 3. 🤖 Dr. Retina AI Chatbot (Gemini Powered)

- **24/7 Health Assistant**: An intelligent chatbot powered by **Google's Gemini 2.0 Flash** model.
- **Context Aware**: Functions as a medical assistant alias "Dr. Retina AI".
- **Expandable Interface**: Floating widget that expands into a full chat interface with message history.
- **Modern UI**: Features blue-themed branding, user/bot avatars, and responsive message bubbles.

### 4. 🎨 Modern UI/UX

- **Dynamic Backgrounds**: Mouse-tracking gradient effects and grid patterns.
- **Glassmorphism**: premium translucent cards and overlays.
- **Interactive Components**: Smooth scrolling, hover effects, and responsive design using Shadcn UI.

---

## 🛠️ Technology Stack

### Frontend (Web App)

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI, Lucid React Icons.
- **Animations**: Framer Motion.
- **State Management**: React Hooks (useState, useRef, custom hooks).

### Backend (API)

- **Framework**: Flask (Python)
- **ML Libraries**: Scikit-learn, TensorFlow/Keras (mockup logic provided in simplified app), Pandas, Numpy.
- **Data Storage**: CSV-based user authentication system (`users.csv`).
- **API**: RESTful endpoints for prediction and auth.

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup (Python)

Navigate to the project root directory:

```bash
# Install Python dependencies
pip install flask flask-cors pandas numpy joblib scikit-learn

# Run the Flask API
python app.py
```

_The backend runs on `http://127.0.0.1:5000`._

### 2. Frontend Setup (Next.js)

Navigate to the `web-app` directory:

```bash
cd web-app

# Install Node dependencies
npm install

# Setup Environment Variables
# Create a .env.local file in web-app/ if it doesn't exist
# Add your Gemini API Key:
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here" > .env.local
```

### 3. Running the Application

With the backend running in one terminal, start the frontend in another:

```bash
# Inside web-app/ directory
npm run dev
```

_The application will be available at `http://localhost:3000`._

---

## 📂 Project Structure

```bash
Health-AI-Assistant/
├── app.py                  # Flask Backend Entry Point
├── users.csv               # User Database (Auto-created)
├── Two classes/            # ML Models (Diabetes)
└── web-app/                # Next.js Frontend
    ├── app/                # App Router Pages
    │   ├── page.tsx        # Homepage (Dashboard)
    │   ├── layout.tsx      # Root Layout (Global CSS/Background)
    │   ├── globals.css     # Global Styles (Tailwind v4)
    │   └── api/chat/       # Next.js API Route for Chat
    ├── components/
    │   ├── ui/             # Reusable UI Components
    │   │   ├── chatbot.tsx           # AI Chat Interface
    │   │   ├── diabetes-scanner.tsx  # Risk Assessment Form
    │   │   ├── retinopathy-scanner.tsx # Image Upload Scanner
    │   │   └── global-background.tsx # Interactive Background
    │   └── auth-screen.tsx # Login/Register Screen
    └── public/             # Static Assets
```

---

## 🔑 Environment Variables

The `web-app` requires the following variables in `.env.local`:

| Variable | Description |
| copy | |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Required for the Chatbot to function (Gemini API). |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional/Legacy. |

---

## 🩺 Usage Guide

1.  **Authentication**: Register a new account or log in with existing credentials (stored locally in `users.csv`).
2.  **Dashboard Navigation**:
    - Click **"Run Diagnosis"** to jump to the Retinopathy Scanner.
    - Click **"Assess Risk"** to jump to the Diabetes Form.
    - Click the **Chat Icon** (bottom right) to talk to Dr. Retina AI.
3.  **Chatbot**: Ask questions like "What are symptoms of DR?" or "How can I lower my glucose?".

---

## ⚠️ Troubleshooting

- **"Failed to connect to analysis server"**: Ensure `python app.py` is running on port 5000.
- **Chatbot Error / "Missing API Key"**: Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set correctly in `web-app/.env.local` and restart the Next.js server.
- **Build Errors**: Run `npm install` to ensure all dependencies (like `lucide-react`, `framer-motion`) are present.

---

**© 2025 Dr. Retina AI Project**

# 🥭 Mango Variety Classifier

An AI-powered web application that classifies mango varieties (Raspuri, Langra, Totapuri) from uploaded images using deep learning (TensorFlow / Keras) and a modern React + Vite frontend.

---

## 🚀 Features

- **Deep Learning Image Classification**: Predicts mango variety with confidence score using trained CNN model.
- **Modern Responsive Frontend**: Built with React and Vite, featuring image preview, glassmorphism UI, and feedback.
- **RESTful Flask API**: Clean Python backend with CORS support and health check endpoints.
- **Ready for Deployment**: Pre-configured for **Vercel** (frontend) and **Render / Railway / Hugging Face Spaces** (backend).

---

## 📁 Project Structure

```
Mango/
├── backend/
│   ├── backend.py                    # Flask API with TensorFlow inference
│   ├── mango_classifier_model_2.h5   # Trained Keras model (tracked via Git LFS)
│   ├── requirements.txt              # Python dependencies
│   ├── Procfile                      # Process file for Render / Railway
│   ├── abc.py                        # Python test script
│   └── IMG_20250606_215124.jpg       # Sample test image
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Main React component
│   │   ├── App.css                   # App styling
│   │   └── main.jsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite build configuration
│   └── vercel.json                   # Vercel SPA routing
├── .gitattributes                    # Git LFS configuration (*.h5)
├── .gitignore                        # Git ignore rules
├── package.json                      # Root workspace scripts
├── vercel.json                       # Root Vercel deployment configuration
└── README.md
```

---

## 🛠️ Local Development

### 1. Backend Setup (Python)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python backend.py
```
The API server will run on `http://127.0.0.1:5000`.

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment Guide

### Deploying Frontend to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your `mango_predictor` repository.
4. **Environment Variables**:
   - Add `VITE_API_URL` with your deployed backend URL (e.g., `https://your-backend.onrender.com`).
5. Click **Deploy**. Vercel will build and serve your site globally.

### Deploying Backend to Render / Cloud

Since the backend runs TensorFlow and a 130MB ML model, deploy it to a Python container platform like [Render](https://render.com) or [Hugging Face Spaces](https://huggingface.co/spaces):

1. Create a new **Web Service** on Render connected to `Chandan0731/mango_predictor`.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `git lfs pull && pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --timeout 120 backend:app`
   - *(Optional)* In **Environment**, ensure `PYTHON_VERSION` is set to `3.11.9` (Render will also read `.python-version` automatically).
3. Once deployed, copy the Render URL (e.g., `https://mango-classifier.onrender.com`).
4. Go back to your **Vercel Project Settings > Environment Variables**, set `VITE_API_URL` to that URL, and redeploy frontend.


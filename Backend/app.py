import os
import shutil
import time
from typing import Dict

import numpy as np
import requests # Needed for fetching external news data
from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Note: TensorFlow/Keras imports are kept but logging is removed
from keras.layers import TFSMLayer
from keras.preprocessing.image import load_img, img_to_array

# -------------------------
# Config
# -------------------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "MRI")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

CLASS_DICT: Dict[int, str] = {0: 'Glioma', 1: 'Meningioma', 2: 'No Tumor', 3: 'Pituitary'}
MODEL = None

# API Key read from the environment variable specified by the user
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY") 

# -------------------------
# FastAPI Setup
# -------------------------
app = FastAPI(title="HealthAI Backend")
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper Functions (Simplified Error Handling)
# -------------------------
def load_model():
    """Load the TensorFlow model once. Using print for critical messages."""
    global MODEL
    
    if not os.path.exists(MODEL_DIR):
        print(f"ERROR: MRI model not found at {MODEL_DIR}") 
        raise FileNotFoundError("MRI model missing. Please include it in the Docker image.")

    import tensorflow as tf
    # Force CPU in production containers without GPU
    try:
        tf.config.set_visible_devices([], 'GPU')
    except Exception:
        pass

    print(f"INFO: Loading model from {MODEL_DIR}...") 
    MODEL = TFSMLayer(MODEL_DIR, call_endpoint="serving_default")
    print("INFO: ✅ Model loaded successfully")

def predict_image(image_path: str):
    """Run inference on a single image."""
    if MODEL is None:
        raise RuntimeError("Model not loaded")

    img = load_img(image_path, target_size=(128, 128))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = MODEL(img_array)
    if isinstance(prediction, dict):
        prediction = next(iter(prediction.values()))

    prediction = prediction.numpy()
    class_index = int(np.argmax(prediction, axis=-1)[0])
    confidence = float(prediction[0][class_index])
    label = CLASS_DICT.get(class_index, "Unknown")
    return label, confidence

# -------------------------
# Startup Event (Simplified Error Handling)
# -------------------------
@app.on_event("startup")
def startup_event():
    print("INFO: Starting HealthAI Backend...") 
    load_model()

# -------------------------
# Root Endpoints
# -------------------------
@app.get("/")
def root():
    return {"status": "online", "service": "HealthAI Backend"}

# -------------------------
# API Router Endpoints (Live News Implemented)
# -------------------------
@router.get("/")
def api_root():
    """API root - fetchRoot()"""
    return {
        "status": "online",
        "service": "HealthAI API",
        "version": "1.0.0"
    }

@router.get("/rays")
def get_rays():
    """Rays page data - fetchRays()"""
    return {
        "status": "success",
        "title": "Medical Imaging Analysis",
        "description": "Upload your MRI scans for AI-powered analysis",
        "supported_formats": ["jpg", "jpeg", "png"],
        "model_ready": MODEL is not None
    }

@router.get("/report")
def get_report():
    """Report page data - fetchReport()"""
    return {
        "status": "success",
        "reports": [],
        "message": "No reports available yet"
    }

@router.get("/about")
def get_about():
    """About page data - fetchAbout()"""
    return {
        "status": "success",
        "name": "HealthAI Labs",
        "description": "AI-powered medical imaging analysis platform",
        "version": "1.0.0",
        "features": ["MRI Analysis", "Brain Tumor Detection", "Medical Reports"]
    }

@router.get("/analysis")
def get_analysis():
    """Analysis page data - fetchAnalysis()"""
    return {
        "status": "success",
        "message": "Analysis Dashboard",
        "available_analyses": ["MRI", "CT Scan", "X-Ray"],
        "recent_analyses": []
    }

@router.get("/askdoctor")
def get_askdoctor():
    """Ask Doctor page data - fetchAskDoctor()"""
    return {
        "status": "success",
        "message": "Ask a Doctor",
        "available": True
    }

@router.get("/contact")
def get_contact():
    """Contact page data - fetchContact()"""
    return {
        "status": "success",
        "email": "contact@healthai.com",
        "phone": "+1-234-567-8900",
        "address": "123 Health St, Medical City"
    }

@router.get("/news")
def get_news(category: str = "health", lang: str = "en", page: int = 1):
    """Fetch Real News from NewsAPI, fixing missing URL and source format."""
    
    if not GNEWS_API_KEY:
        print("CRITICAL: GNEWS_API_KEY environment variable is NOT set. Returning mock data.")
        # Mock data structure updated to match React frontend expectations (url, image, structured source)
        return {
             "status": "success",
             "category": category,
             "language": lang,
             "page": page,
             "total_pages": 5,
             "articles": [
                 {
                     "id": "mock-1",
                     "title": "Mock Data: AI in Disease Diagnostics",
                     "description": "This is mock data because the GNEWS_API_KEY environment variable is not set. Please set the key to see real news.",
                     "publishedAt": "2025-11-28T10:00:00Z", 
                     "source": {"name": "Mock News Daily"},
                     "url": "https://www.example.com/mock-article-1",
                     "image": "https://placehold.co/600x337/3b82f6/ffffff?text=MOCK+NEWS"
                 }
             ]
         }

    # NewsAPI Endpoint
    url = f"https://newsapi.org/v2/top-headlines?category={category}&language={lang}&page={page}&pageSize=20&apiKey={GNEWS_API_KEY}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status() # Raise an exception for HTTP error codes
        data = response.json()
        
        if data.get("status") != "ok":
            print(f"ERROR: NewsAPI returned status '{data.get('status')}' - Message: {data.get('message')}")
            return {"status": "error", "articles": [], "message": data.get('message')}

        # Format Data for React Frontend
        formatted_articles = []
        for article in data.get("articles", []):
            if article.get("title") == "[Removed]" or not article.get("url"):
                continue

            # Ensure all expected fields are present, using fallbacks if necessary
            formatted_articles.append({
                "id": article.get("url"), 
                "title": article.get("title", "No Title Available"),
                "description": article.get("description", article.get("content", "No description available.")),
                "url": article.get("url"),         # This is the critical field for the link
                "image": article.get("urlToImage"), # This is the critical field for the image
                "publishedAt": article.get("publishedAt"),
                "source": {
                    "name": article.get("source", {}).get("name", "Unknown Source")
                }
            })

        # Calculate total pages (assuming 20 articles per page, typical for NewsAPI)
        total_results = data.get("totalResults", 100)
        total_pages = min(int(total_results / 20) + 1, 5) # Cap at 5 pages to manage rate limits

        return {
            "status": "success",
            "category": category,
            "language": lang,
            "page": page,
            "total_pages": total_pages,
            "articles": formatted_articles
        }

    except requests.exceptions.RequestException as e:
        print(f"ERROR: Failed to connect to NewsAPI: {e}")
        return {
            "status": "error",
            "articles": [],
            "message": "Connection error to external news service."
        }

@router.post("/rays/mri")
async def analyze_mri(file: UploadFile = File(...)):
    """Analyze MRI scan - uploadMri()"""
    if MODEL is None:
        return JSONResponse(status_code=503, content={"error": "AI Model not ready"})

    temp_filename = os.path.join(UPLOAD_DIR, f"{int(time.time())}_{file.filename}")

    try:
        # Save uploaded file
        with open(temp_filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Predict
        label, confidence = predict_image(temp_filename)
        
        return {
            "status": "success",
            "prediction": label,
            "confidence": float(confidence),
            "confidence_percent": f"{confidence:.2%}",
            "details": {"class": label, "score": float(confidence)}
        }
    except Exception as e:
        print(f"ERROR: MRI analysis failed: {str(e)}")
        return JSONResponse(
            status_code=500, 
            content={"error": "Analysis failed", "message": str(e)}
        )
    finally:
        # Clean up
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

# Include router with /api prefix
app.include_router(router, prefix="/api")

# -------------------------
# Run Uvicorn in Prod
# -------------------------
if __name__ == "__main__":
    import uvicorn
    # log_level is set to "info" for general container health visibility
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
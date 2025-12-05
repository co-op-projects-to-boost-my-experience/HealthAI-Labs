import os
import shutil
import time
from typing import Dict

import numpy as np
import pandas as pd
import joblib
import requests  # Needed for fetching external news data
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
CKD_MODEL_DIR = os.path.join(os.path.dirname(__file__), "CKD")
CKD_SCALER_PATH = os.path.join(CKD_MODEL_DIR, "data_scaler.joblib")
CKD_DIAGNOSIS_PATH = os.path.join(CKD_MODEL_DIR, "ckd_diagnosis_model.joblib")
CKD_STAGE_PATH = os.path.join(CKD_MODEL_DIR, "ckd_stage_model.joblib")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

CLASS_DICT: Dict[int, str] = {0: 'Glioma', 1: 'Meningioma', 2: 'No Tumor', 3: 'Pituitary'}
MRI_MODEL = None
CKD_SCALER = None
CKD_DIAGNOSIS_MODEL = None
CKD_STAGE_MODEL = None
CKD_MODEL_READY = False

# CKD Feature Order
FEATURE_ORDER = ['gfr', 'c3_c4', 'blood_pressure', 'serum_creatinine', 'serum_calcium', 'bun', 'urine_ph', 'oxalate_levels']

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
# Helper Functions (MRI Model)
# -------------------------
def load_mri_model():
    """Load the TensorFlow MRI model once. Using print for critical messages."""
    global MRI_MODEL
    
    if not os.path.exists(MODEL_DIR):
        print(f"ERROR: MRI model not found at {MODEL_DIR}")
        raise FileNotFoundError("MRI model missing. Please include it in the Docker image.")

    import tensorflow as tf
    # Force CPU in production containers without GPU
    try:
        tf.config.set_visible_devices([], 'GPU')
    except Exception:
        pass

    print(f"INFO: Loading MRI model from {MODEL_DIR}...")
    MRI_MODEL = TFSMLayer(MODEL_DIR, call_endpoint="serving_default")
    print("INFO: ✅ MRI Model loaded successfully")

def predict_mri_image(image_path: str):
    """Run inference on a single MRI image."""
    if MRI_MODEL is None:
        raise RuntimeError("MRI Model not loaded")

    img = load_img(image_path, target_size=(128, 128))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = MRI_MODEL(img_array)
    if isinstance(prediction, dict):
        prediction = next(iter(prediction.values()))

    prediction = prediction.numpy()
    class_index = int(np.argmax(prediction, axis=-1)[0])
    confidence = float(prediction[0][class_index])
    label = CLASS_DICT.get(class_index, "Unknown")
    return label, confidence

# -------------------------
# Helper Functions (CKD Model)
# -------------------------
def load_ckd_models():
    """Load the CKD models (scaler, diagnosis, stage) from CKD directory."""
    global CKD_SCALER, CKD_DIAGNOSIS_MODEL, CKD_STAGE_MODEL, CKD_MODEL_READY
    
    try:
        # Check if CKD directory exists
        if not os.path.exists(CKD_MODEL_DIR):
            print(f"WARNING: CKD model directory not found at {CKD_MODEL_DIR}")
            return
            
        # Check if all required files exist
        if not all([
            os.path.exists(CKD_SCALER_PATH),
            os.path.exists(CKD_DIAGNOSIS_PATH),
            os.path.exists(CKD_STAGE_PATH)
        ]):
            print(f"WARNING: CKD model files not found in {CKD_MODEL_DIR}")
            print(f"  Scaler: {os.path.exists(CKD_SCALER_PATH)}")
            print(f"  Diagnosis: {os.path.exists(CKD_DIAGNOSIS_PATH)}")
            print(f"  Stage: {os.path.exists(CKD_STAGE_PATH)}")
            return
        
        print(f"INFO: Loading CKD models from {CKD_MODEL_DIR}...")
        CKD_SCALER = joblib.load(CKD_SCALER_PATH)
        CKD_DIAGNOSIS_MODEL = joblib.load(CKD_DIAGNOSIS_PATH)
        CKD_STAGE_MODEL = joblib.load(CKD_STAGE_PATH)
        CKD_MODEL_READY = True
        print("INFO: ✅ CKD Models loaded successfully")
    except Exception as e:
        print(f"ERROR: Failed to load CKD models: {e}")
        CKD_MODEL_READY = False

# -------------------------
# Startup Event
# -------------------------
@app.on_event("startup")
def startup_event():
    print("INFO: Starting HealthAI Backend...")
    load_mri_model()
    load_ckd_models()

# -------------------------
# Root Endpoints
# -------------------------
@app.get("/")
def root():
    return {"status": "online", "service": "HealthAI Backend"}

# -------------------------
# API Router Endpoints
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
        "model_ready": MRI_MODEL is not None
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
        "features": ["MRI Analysis", "Brain Tumor Detection", "Medical Reports", "CKD Analysis"]
    }

@router.get("/analysis")
def get_analysis():
    """Analysis page data - fetchAnalysis()"""
    return {
        "status": "success",
        "message": "Analysis Dashboard",
        "available_analyses": [
            {
                "id": "brain-mri",
                "name": "Brain MRI Analysis",
                "description": "Advanced AI analysis of brain MRI scans for tumor detection and classification",
                "type": "image",
                "ready": MRI_MODEL is not None
            },
            {
                "id": "ckd-analysis",
                "name": "Chronic Kidney Disease Analysis",
                "description": "Comprehensive CKD analysis from laboratory data",
                "type": "data",
                "ready": CKD_MODEL_READY
            },
            {
                "id": "chest-xray",
                "name": "Chest X-Ray Analysis",
                "description": "Comprehensive chest X-ray analysis for respiratory conditions",
                "type": "image",
                "ready": False,
                "coming_soon": True
            }
        ],
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
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") != "ok":
            print(f"ERROR: NewsAPI returned status '{data.get('status')}' - Message: {data.get('message')}")
            return {"status": "error", "articles": [], "message": data.get('message')}

        # Format Data for React Frontend
        formatted_articles = []
        for article in data.get("articles", []):
            if article.get("title") == "[Removed]" or not article.get("url"):
                continue

            formatted_articles.append({
                "id": article.get("url"),
                "title": article.get("title", "No Title Available"),
                "description": article.get("description", article.get("content", "No description available.")),
                "url": article.get("url"),
                "image": article.get("urlToImage"),
                "publishedAt": article.get("publishedAt"),
                "source": {
                    "name": article.get("source", {}).get("name", "Unknown Source")
                }
            })

        total_results = data.get("totalResults", 100)
        total_pages = min(int(total_results / 20) + 1, 5)

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

# -------------------------
# MRI Analysis Endpoint
# -------------------------
@router.post("/rays/mri")
async def analyze_mri(file: UploadFile = File(...)):
    """Analyze MRI scan - uploadMri()"""
    if MRI_MODEL is None:
        return JSONResponse(status_code=503, content={"error": "MRI Model not ready"})

    temp_filename = os.path.join(UPLOAD_DIR, f"{int(time.time())}_{file.filename}")

    try:
        # Save uploaded file
        with open(temp_filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Predict
        label, confidence = predict_mri_image(temp_filename)
        
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

# -------------------------
# CKD Analysis Endpoints
# -------------------------
@router.post("/analysis/ckd/file")
async def analyze_ckd_file(file: UploadFile = File(...)):
    """
    Analyze CKD data uploaded as a CSV file (one column per feature).
    Expected columns: gfr, c3_c4, blood_pressure, serum_creatinine, serum_calcium, bun, urine_ph, oxalate_levels
    """
    if not CKD_MODEL_READY:
        return JSONResponse(status_code=503, content={"error": "CKD Models not ready"})

    temp_filename = os.path.join(UPLOAD_DIR, f"ckd_input_{int(time.time())}_{file.filename}")

    try:
        # Save uploaded file temporarily
        with open(temp_filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Read CSV file
        input_df = pd.read_csv(temp_filename)
        
        if len(input_df.columns) != len(FEATURE_ORDER):
            raise ValueError(
                f"Number of columns in the file ({len(input_df.columns)}) does not match required features ({len(FEATURE_ORDER)}). "
                f"Expected columns: {', '.join(FEATURE_ORDER)}"
            )

        # Ensure correct column order and scale features
        input_df = input_df[FEATURE_ORDER]
        scaled_features = CKD_SCALER.transform(input_df)

        # Predict diagnosis (only first row)
        diagnosis_prediction = CKD_DIAGNOSIS_MODEL.predict(scaled_features)[0]

        if diagnosis_prediction == 1:
            stage_prediction = CKD_STAGE_MODEL.predict(scaled_features)[0]
            result = {
                "diagnosis_result": "Positive - Chronic Kidney Disease detected.",
                "ckd_stage": f"Stage {int(stage_prediction)}",
            }
        else:
            result = {
                "diagnosis_result": "Negative - No Chronic Kidney Disease detected.",
                "ckd_stage": "Not applicable",
            }

        return {
            "status": "success",
            "prediction": result["diagnosis_result"],
            "ckd_stage": result["ckd_stage"],
            "diagnosis_code": int(diagnosis_prediction)
        }

    except Exception as e:
        print(f"ERROR: CKD analysis failed: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Analysis failed", "message": f"Error processing file and predicting: {str(e)}"}
        )
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@router.post("/analysis/ckd/manual")
async def analyze_ckd_manual(
    gfr: float,
    c3_c4: float,
    blood_pressure: float,
    serum_creatinine: float,
    serum_calcium: float,
    bun: float,
    urine_ph: float,
    oxalate_levels: float
):
    """
    Analyze CKD data from manual input (form data).
    """
    if not CKD_MODEL_READY:
        return JSONResponse(status_code=503, content={"error": "CKD Models not ready"})

    try:
        # Create DataFrame from input
        input_data = {
            'gfr': [gfr],
            'c3_c4': [c3_c4],
            'blood_pressure': [blood_pressure],
            'serum_creatinine': [serum_creatinine],
            'serum_calcium': [serum_calcium],
            'bun': [bun],
            'urine_ph': [urine_ph],
            'oxalate_levels': [oxalate_levels]
        }

        input_df = pd.DataFrame(input_data)
        input_df = input_df[FEATURE_ORDER]

        # Scale features
        scaled_features = CKD_SCALER.transform(input_df)

        # Predict diagnosis
        diagnosis_prediction = CKD_DIAGNOSIS_MODEL.predict(scaled_features)[0]

        if diagnosis_prediction == 1:
            stage_prediction = CKD_STAGE_MODEL.predict(scaled_features)[0]
            result = {
                "diagnosis_result": "Positive - Chronic Kidney Disease detected.",
                "ckd_stage": f"Stage {int(stage_prediction)}",
            }
        else:
            result = {
                "diagnosis_result": "Negative - No Chronic Kidney Disease detected.",
                "ckd_stage": "Not applicable",
            }

        return {
            "status": "success",
            "prediction": result["diagnosis_result"],
            "ckd_stage": result["ckd_stage"],
            "diagnosis_code": int(diagnosis_prediction),
            "input_data": input_data
        }

    except Exception as e:
        print(f"ERROR: CKD manual analysis failed: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Analysis failed", "message": str(e)}
        )

# Include router with /api prefix
app.include_router(router, prefix="/api")

# -------------------------
# Run Uvicorn in Prod
# -------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend container to access backend
origins = [
    "http://frontend",  # Frontend service name in Docker
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to Health API"}

@app.get("/rays")
async def rays():
    return {"message": "Medical imaging analysis"}

@app.get("/report")
async def report():
    return {"message": "Health report generation"}

@app.get("/about")
async def about():
    return {"message": "About our service"}

@app.get("/news")
async def news():
    return {"message": "Healthcare news"}

@app.get("/analysis")
async def analysis():
    return {"message": "Symptom analysis"}

@app.get("/askdoctor")
async def ask_doctor():
    return {"message": "AI doctor consultation"}

@app.get("/contact")
async def contact():
    return {"message": "contact us"}

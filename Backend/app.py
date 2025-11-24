from fastapi import FastAPI

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

@app.get("/ask-doctor")
async def ask_doctor():
    return {"message": "AI doctor consultation"}

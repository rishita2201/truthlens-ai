from fastapi import FastAPI, UploadFile, File
from PIL import Image
import numpy as np
import io

app = FastAPI(
    title="TruthLens AI API",
    description="Deepfake Detection Backend",
    version="1.0"
)

@app.get("/")
def home():
    return {"message": "TruthLens AI Backend is running"}

@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Convert image to numpy (placeholder pipeline)
    image_np = np.array(image)

    # DUMMY prediction (we replace later with real model)
    fake_probability = 0.73

    return {
        "filename": file.filename,
        "fake_probability": fake_probability,
        "status": "processed"
    }
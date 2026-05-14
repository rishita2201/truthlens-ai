from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import numpy as np

from services.inference import predict_image

app = FastAPI(
    title="TruthLens AI",
    description="Deepfake Detection Backend",
    version="1.0"
)

@app.get("/")
def home():
    return {"message": "TruthLens AI Running"}

@app.post("/predict/image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    # Read uploaded file
    contents = await file.read()

    # Convert to image
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Run ML inference
    probability = predict_image(image)

    return {
        "filename": file.filename,
        "fake_probability": float(probability),
        "label": "fake" if probability > 0.5 else "real"
    }
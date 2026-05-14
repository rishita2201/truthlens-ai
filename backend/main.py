from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from PIL import UnidentifiedImageError
import io

try:
    from .services.inference import analyze_image
except ImportError:
    from services.inference import analyze_image

app = FastAPI(
    title="TruthLens AI",
    description="Deepfake Detection Backend",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "TruthLens AI Running"}

@app.post("/predict/image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    # Read uploaded file
    contents = await file.read()

    # Convert to image
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image") from exc

    # Run ML inference and explainability
    result = analyze_image(image)
    probability = result["fake_probability"]

    return {
        "filename": file.filename,
        "fake_probability": float(probability),
        "label": "fake" if probability > 0.5 else "real",
        "heatmap_png_base64": result["heatmap_png_base64"],
    }

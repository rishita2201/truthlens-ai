import torch
from PIL import Image
import torchvision.transforms as transforms
from model.model import DeepfakeModel

# Load model
model = DeepfakeModel()
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict_image(image: Image.Image):

    image = transform(image)
    image = image.unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        prob = output.item()

    return prob
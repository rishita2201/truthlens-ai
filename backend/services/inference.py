import base64
import io

import torch
from PIL import Image
from PIL import ImageEnhance
import torchvision.transforms as transforms

try:
    from ..model.model import DeepfakeModel
except ImportError:
    from model.model import DeepfakeModel

# Load model
model = DeepfakeModel()
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def _tensor_to_overlay(heatmap: torch.Tensor, original_image: Image.Image) -> str:
    heatmap = heatmap.detach().cpu().clamp(0, 1)
    heatmap_image = Image.fromarray((heatmap.numpy() * 255).astype("uint8"), mode="L")
    heatmap_image = heatmap_image.resize(original_image.size, Image.Resampling.BILINEAR)

    red_overlay = Image.new("RGBA", original_image.size, (255, 0, 0, 0))
    red_overlay.putalpha(heatmap_image)
    red_overlay = ImageEnhance.Contrast(red_overlay).enhance(1.5)

    base_image = original_image.convert("RGBA")
    blended = Image.alpha_composite(base_image, red_overlay)

    buffer = io.BytesIO()
    blended.convert("RGB").save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def predict_image(image: Image.Image):
    return analyze_image(image)["fake_probability"]


def analyze_image(image: Image.Image):
    activations = None
    gradients = None

    def save_activation(_module, _inputs, output):
        nonlocal activations
        activations = output

    def save_gradient(_module, _grad_input, grad_output):
        nonlocal gradients
        gradients = grad_output[0]

    target_layer = model.model.layer4[-1]
    forward_handle = target_layer.register_forward_hook(save_activation)
    backward_handle = target_layer.register_full_backward_hook(save_gradient)

    image_tensor = transform(image).unsqueeze(0)

    try:
        output = model(image_tensor)
        prob = output.item()
        model.zero_grad()
        output.backward()
    finally:
        forward_handle.remove()
        backward_handle.remove()

    if activations is None or gradients is None:
        raise RuntimeError("Unable to generate Grad-CAM heatmap")

    weights = gradients.mean(dim=(2, 3), keepdim=True)
    heatmap = (weights * activations).sum(dim=1).squeeze(0)
    heatmap = torch.relu(heatmap)

    max_value = heatmap.max()
    if max_value > 0:
        heatmap = heatmap / max_value

    return {
        "fake_probability": prob,
        "heatmap_png_base64": _tensor_to_overlay(heatmap, image),
    }

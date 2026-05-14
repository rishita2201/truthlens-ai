import torch
import torch.nn as nn
from torchvision import models

class DeepfakeModel(nn.Module):
    def __init__(self):
        super(DeepfakeModel, self).__init__()

        # FIXED torchvision API (no warnings)
        self.model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

        # Replace classifier for binary output
        self.model.fc = nn.Linear(self.model.fc.in_features, 1)

        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.model(x)
        x = self.sigmoid(x)
        return x
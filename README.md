# TruthLens AI

> AI-powered deepfake forensic analysis platform with explainable AI, multimedia authenticity detection, and interactive forensic visualization.

![Status](https://img.shields.io/badge/status-under%20development-orange)
![Python](https://img.shields.io/badge/python-3.11-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-AI-red)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-green)
![Next.js](https://img.shields.io/badge/Next.js-frontend-black)
![License](https://img.shields.io/badge/license-MIT-purple)

---

## Overview

TruthLens AI is an advanced deepfake detection and multimedia forensic analysis platform designed to identify manipulated images, videos, and synthetic audio using AI-powered forensic techniques.

Unlike traditional deepfake classifiers that only output a probability score, TruthLens AI focuses on **Explainable AI (XAI)** and forensic transparency by visualizing suspicious regions, frequency anomalies, and manipulation artifacts.

The platform aims to provide an interactive investigation experience for:
- cybersecurity analysts
- researchers
- journalists
- digital forensic investigators
- AI researchers

---

# Features

## Current MVP Goals

- Deepfake image detection
- Fake probability scoring
- Explainable AI heatmaps
- Interactive forensic dashboard
- FastAPI inference backend
- Modern responsive frontend

---

# Planned Features

## Image Forensics
- GAN artifact detection
- Texture inconsistency analysis
- Facial manipulation heatmaps
- Frequency spectrum analysis

## Video Forensics
- Blink anomaly detection
- Temporal inconsistency analysis
- Lip-sync mismatch detection
- Frame-level manipulation tracing

## Audio Forensics
- Synthetic voice detection
- Spectrogram anomaly analysis
- Harmonic inconsistency detection

## AI Explainability
- Grad-CAM visualizations
- Attention mapping
- AI-generated forensic explanations
- Confidence calibration

## Advanced Features
- Live webcam deepfake detection
- Real-time analysis
- AI forensic report generation
- Interactive investigation dashboard
- Threat intelligence integration

---

# Tech Stack

## Frontend
- Next.js
- Tailwind CSS
- Framer Motion

## Backend
- FastAPI
- Python
- Uvicorn

## AI / ML
- PyTorch
- XceptionNet
- Vision Transformers
- Grad-CAM

## Computer Vision
- OpenCV
- MediaPipe
- Dlib

## Audio Processing
- librosa
- torchaudio

---

# Architecture

```text
User Upload
     ↓
Frontend Dashboard (Next.js)
     ↓
FastAPI Backend
     ↓
Deepfake Detection Model
     ↓
Explainability Engine
     ↓
Forensic Visualization Layer
     ↓
Results + AI Explanation
```

---

# Project Structure

```text
truthlens-ai/
│
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── model/             # Trained models/checkpoints
├── notebooks/         # Research notebooks
├── docs/              # Documentation
├── assets/            # Images/GIFs/screenshots
├── datasets/          # Dataset references
│
├── README.md
├── requirements.txt
└── .env.example
```

---

# Explainable AI Layer

TruthLens AI focuses heavily on forensic explainability instead of black-box predictions.

The explainability layer includes:
- Grad-CAM heatmaps
- Attention visualization
- Frequency-domain artifact analysis
- Blink anomaly tracing
- Manipulation region highlighting

This enables users to understand *why* the model classified content as manipulated.

---

# Datasets

Planned datasets include:
- FaceForensics++
- Celeb-DF
- DeepFake Detection Challenge Dataset
- FakeAVCeleb
- ASVspoof

---

# Roadmap

## Phase 1
- [x] Repository setup
- [ ] FastAPI backend
- [ ] Image upload API
- [ ] Pretrained model integration
- [ ] Deepfake image inference
- [ ] Grad-CAM heatmaps

## Phase 2
- [ ] Interactive frontend dashboard
- [ ] Advanced visualizations
- [ ] Video deepfake detection
- [ ] Blink anomaly analysis

## Phase 3
- [ ] Audio deepfake detection
- [ ] Lip-sync analysis
- [ ] Spectrogram visualization

## Phase 4
- [ ] Real-time webcam analysis
- [ ] AI forensic report generation
- [ ] Cloud deployment
- [ ] Docker infrastructure

---

# Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/truthlens-ai.git
cd truthlens-ai
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Windows
```bash
venv\Scripts\activate
```

#### Linux / Mac
```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Running Backend

From the repository root:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Or from inside the backend directory:

```bash
uvicorn main:app --reload
```

---

# Vision

TruthLens AI aims to evolve into a comprehensive AI-powered multimedia forensic platform capable of:
- detecting synthetic media
- visualizing manipulation evidence
- improving digital trust
- assisting forensic investigations

---

# Contributing

Contributions, ideas, feature suggestions, and research collaborations are welcome.

Future contribution guidelines will be added soon.

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by Rishita R.

BTech CSE (Cyber Security & AI/ML) student at :contentReference[oaicite:0]{index=0}.

---

# Status

🚧 Active Development in Progress

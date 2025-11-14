from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# HuggingFace model 로딩 (한 번만)
classifier = pipeline("text-classification", model="dlckdfuf141/korean-emotion-kluebert-v2")

class DiaryText(BaseModel):
    text: str

class Emotion(BaseModel):
    label: str
    score: float
    intensity: list

@app.post("/analyze")
def analyze(diary: DiaryText):
    result = classifier(diary.text)[0]
    return {
        "label": result["label"],
        "score": result["score"],
        "intensity": round(result["score"] * 100)
    }

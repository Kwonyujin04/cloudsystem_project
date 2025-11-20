from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import (
    BartForConditionalGeneration,
    PreTrainedTokenizerFast,
    pipeline
)
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer

warnings.filterwarnings('ignore', category=UserWarning)

app = FastAPI()

# ====== 1. 요약 모델 로딩 ======
summary_tokenizer = PreTrainedTokenizerFast.from_pretrained("gogamza/kobart-base-v2")
summary_model = BartForConditionalGeneration.from_pretrained("gogamza/kobart-base-v2")

# ====== 2. 감정 분석 모델 로딩 ======
emotion_classifier = pipeline(
    "text-classification",
    model="dlckdfuf141/korean-emotion-kluebert-v2"
)

#keyword 모델
embed_model_id = "skt/kobert-base-v1" 

embedding_model = SentenceTransformer(embed_model_id)
keyword_model = KeyBERT(model=embedding_model)


# ====== 공통 요청 모델 ======
class TextRequest(BaseModel):
    text: str

# ====== 응답 모델 ======
class SummaryResponse(BaseModel):
    summary: str

class EmotionResponse(BaseModel):
    label: str
    score: float
    intensity: int   # 퍼센트 값 (0~100)

class KeywordResponse(BaseModel):
    keywords: list[str] # 추출된 키워드 목록

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)


# ====== /summarize 엔드포인트 ======
@app.post("/summarize", response_model=SummaryResponse)
def summarize(input: TextRequest):
    input_text = input.text

    # 입력 텍스트 인코딩
    input_ids = summary_tokenizer.encode(input_text, return_tensors="pt")

    # 요약 생성
    output_ids = summary_model.generate(
        input_ids,
        max_length=150,            # 요약 최대 길이
        min_length=30,             # 요약 최소 길이
        num_beams=5,               # beam search 크기
        repetition_penalty=2.0,
        no_repeat_ngram_size=3,
        eos_token_id=1,
        bad_words_ids=[[summary_tokenizer.unk_token_id]],
    )

    # 디코딩
    output_text = summary_tokenizer.decode(
        output_ids.squeeze().tolist(),
        skip_special_tokens=True
    )

    return {"summary": output_text}


# ====== /analyze 엔드포인트 ======
@app.post("/analyze", response_model=EmotionResponse)
def analyze(diary: TextRequest):
    result = emotion_classifier(diary.text)[0]

    return {
        "label": str(result["label"]),
        "score": result["score"],
        "intensity": round(result["score"] * 100),  # 점수를 %로 변환
    }

#키워드 엔드포인트
@app.post("/extract_keywords", response_model=KeywordResponse)
def extract_keywords(input: TextRequest):

    diary_text = input.text
    
    # KeyBERT를 사용하여 키워드 추출
    keywords_with_scores = keyword_model.extract_keywords(
        docs=diary_text, 
        keyphrase_ngram_range=(1, 3), 
        stop_words=None, 
        top_n=5,
    )
    
    # (키워드, 점수)에서 키워드만 추출
    keywords = [keyword for keyword, score in keywords_with_scores]
    
    return {
        "keywords": keywords
    }

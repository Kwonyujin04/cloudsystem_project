from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import (
    pipeline,
)
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import warnings
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
import sys
import random
import re

warnings.filterwarnings('ignore', category=UserWarning)

app = FastAPI()

# ====== 감정-검색 매핑 ======
EMOTION_SEARCH_WORD = {
    # 감정에 맞는 장르 사전 설정
    '행복': 'happy kpop upbeat',
    '슬픔': 'ballad emotional sad',
    '분노': 'aggressive hard rock',
    '놀람': 'energetic exciting pop',
    '공포': 'ambient calm meditation',
    '혐오': 'blues catharsis classic heavy',
    '중립': 'cafe instrumental jazz',
}

# ====== 인덱스-한국어 매핑 ======
EMOTION_KOREAN_LABELS = [
    '공포',
    '놀람',
    '분노',
    '슬픔',
    '중립',
    '행복',
    '혐오'
]

def get_emotion_korean_label(default_label: str) -> str:

    #숫자 인덱스 한국어로 변환
    index = int(default_label)

    if 0 <= index < len(EMOTION_KOREAN_LABELS):
        return EMOTION_KOREAN_LABELS[index]

    #예외 처리
    return '중립'

# ====== 요약 모델 로드 ======
print("요약 모델 초기화 완료")
summarizer = None

# ====== 감정 분석 모델 로드 ======
emotion_classifier = pipeline(
    "text-classification",
    model="dlckdfuf141/korean-emotion-kluebert-v2"
)
print("감정 분석 모델 로드 완료")

# ====== 키워드 추출 모델 ======
embed_model = "jhgan/ko-sroberta-multitask"
st_model = SentenceTransformer(embed_model)
keyword_model = KeyBERT(model=st_model)
print("키워드 추출 로드 완료")


# ====== Spotify 클라이언트 초기화 ======
try:
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

    if client_id:
        print(f"Client ID: {client_id}")
    if client_secret:
        print(f"Client Secret: {client_secret}")

    if not client_id or not client_secret:
        raise ValueError("환경 변수 설정되지 않음.")

    spotify_client = spotipy.Spotify(
        auth_manager=SpotifyClientCredentials(
            client_id=client_id,
            client_secret=client_secret
        )
    )
    print("Spotify 클라이언트 초기화 완료")
except Exception as e:
    print(f"Spotify 클라이언트 초기화 실패: {e}")
    spotify_client = None

# Pydantic 모델 정의
class TextRequest(BaseModel):
    text: str

class EmotionRequest(BaseModel):
    emotion_label: str

class SummaryResponse(BaseModel):
    summary: str

class EmotionResponse(BaseModel):
    label: str
    score: float
    intensity: int

class KeywordItem(BaseModel):
    keyword: str
    relevance_score: float

class KeywordResponse(BaseModel):
    keywords: list[KeywordItem]

class MusicRecommendation(BaseModel):
    artist: str
    track_title: str
    cover_url: str | None = None
    spotify_url: str

class MusicResponse(BaseModel):
    emotion_seed: str
    recommendations: list[MusicRecommendation]


# ====== 노래 추천 처리 함수 ======
def recommend_process(tracks_list: list, emotion_label: str, identifier: str) -> MusicResponse:
    recommend_track_list = []

    available_tracks = [track for track in tracks_list if track]

    if not available_tracks:
        return MusicResponse(
            emotion_seed=f"'{emotion_label}' (검색: {identifier})",
            recommendations=[]
        )

    recommend_num = min(3, len(available_tracks))
    selected_tracks = random.sample(available_tracks, recommend_num)

    for track in selected_tracks:
        artists = ", ".join([artist['name'] for artist in track['artists']])
        recommend_track_list.append(
            MusicRecommendation(
                artist=artists,
                track_title=track['name'],
                cover_url=track['album']['images'][0]['url'],
                spotify_url=track['external_urls']['spotify']
            )
        )

    return MusicResponse(
        emotion_seed = f"'{emotion_label}' (검색: {identifier})",
        recommendations = recommend_track_list
    )


# ====== /recommend_music_by_emotion 엔드포인트 ======
@app.post("/recommend_music_by_emotion", response_model=MusicResponse, summary="감정 기반 음악 추천 (장르 매핑 기반)")
def recommend_music_by_emotion(input: EmotionRequest):

    emotion_label = input.emotion_label

    search_query = EMOTION_SEARCH_WORD.get(emotion_label, EMOTION_SEARCH_WORD['중립'])

    search_results = spotify_client.search(
            q=search_query,
            type='track',
            limit=50
        )

    tracks = search_results.get('tracks', {}).get('items', [])

    return recommend_process(tracks, emotion_label, search_query)



# ====== /recommend_music 엔드포인트 ======
@app.post("/recommend_music", response_model=MusicResponse)
def recommend_music(input: TextRequest):
    emotion_result = emotion_classifier(input.text)

    if not emotion_result or not isinstance(emotion_result, list) or not emotion_result[0].get("label"):
        raw_label = '중립'
    else:
        raw_label = str(emotion_result[0]["label"])

    emotion_label = get_emotion_korean_label(raw_label)

    return recommend_music_by_emotion(EmotionRequest(emotion_label=emotion_label))


# ====== /summarize 엔드포인트 ======
@app.post("/summarize", response_model=SummaryResponse)
def summarize(input: TextRequest):
    diary_text = input.text

    # 문장 분리
    sentences = re.split(r'(?<=[.?!])\s+', diary_text)

    if not sentences or len(sentences) <= 1:
        return {"summary": diary_text}

    try:
        # KeyBERT를 사용하여 문장 기반 요약
        summarized_sentences = keyword_model.extract_keywords(
            docs=sentences,
            keyphrase_ngram_range=(1, 1),
            use_maxsum=False,
            use_mmr=True,
            diversity=0.5,
            top_n=5
        )

        extracted_texts = [
            item[0]
            for item in summarized_sentences
            if isinstance(item, tuple) and len(item) > 0 and isinstance(item[0], str)
        ]

        if not extracted_texts:
             #원본 텍스트 첫 문장 반환
             #return{"summary": "추출안됨"}
             return {"summary": sentences[0]}

        #요약 문장들 정렬
        sorted_summaries = sorted(
            extracted_texts,
            key=lambda x: sentences.index(x) if x in sentences else len(sentences)
        )

        #공백으로 합치기
        final_summary = " ".join(sorted_summaries).strip()

        if not final_summary:
            return {"summary": "요약을 생성 불가"}

        return {"summary": final_summary}

    except Exception as e:
        print(f"Error during extractive summarization: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"요약 생성 오류 발생. Error: {str(e)}"
        )


# ====== /analyze 엔드포인트 ======
@app.post("/analyze", response_model=EmotionResponse)
def analyze(diary: TextRequest):
    result = emotion_classifier(diary.text)[0]

    raw_label = str(result["label"])

    return {
        "label": raw_label,
        "score": result["score"],
        "intensity": round(result["score"] * 100),
    }

@app.post("/extract_keywords", response_model=KeywordResponse)
def extract_keywords(input: TextRequest):
    diary_text = input.text

    keywords_with_scores = keyword_model.extract_keywords(
        docs=diary_text,
        keyphrase_ngram_range=(1, 2), #키워드 길이 줄임
        stop_words=None,
        top_n=20,
        use_mmr=True,
        diversity=0.5
    )
    keywords = [
        KeywordItem(keyword=keyword, relevance_score=score)
        for keyword, score in keywords_with_scores
    ]
    return {"keywords": keywords}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

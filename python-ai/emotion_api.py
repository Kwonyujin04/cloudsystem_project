from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import (
    BartForConditionalGeneration,
    PreTrainedTokenizerFast,
    pipeline,
)
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import warnings
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os 
import sys

warnings.filterwarnings('ignore', category=UserWarning)

# Spotify API 관련 설정
#트랙 ID 목록
FALLBACK_TRACK_IDS = ["11dFghVXANMlKmJXsNCbNl", "0VjIjW4GlGqdAlJlYtkFgZ", "5Qn0jIjW4GlGqdAlJlYtkFgZ"]

app = FastAPI()

# ====== 1. 요약 모델 로딩 ======
summary_tokenizer = PreTrainedTokenizerFast.from_pretrained("gogamza/kobart-base-v2")
summary_model = BartForConditionalGeneration.from_pretrained("gogamza/kobart-base-v2")

# ====== 2. 감정 분석 모델 로딩 ======
emotion_classifier = pipeline(
    "text-classification",
    model="dlckdfuf141/korean-emotion-kluebert-v2"
)

# ====== 3. 키워드 추출 모델  ======
embed_model_id = "jhgan/ko-sroberta-multitask" 
keyword_model = None

st_model = SentenceTransformer(embed_model_id)
keyword_model = KeyBERT(model=st_model)


# ====== 4. Spotify 클라이언트 초기화 ======
print("Spotify 클라이언트 초기화 중")
try:
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

    if not client_id or not client_secret:
        # 환경 변수 없이는 실패로 간주
        raise ValueError("환경 변수가 설정되지 않았습니다.")

    spotify_client = spotipy.Spotify(
        auth_manager=SpotifyClientCredentials(
            client_id=client_id,
            client_secret=client_secret
        )
    )
    print("Spotify 클라이언트 초기화 완료.")
except Exception as e:
    print(f"Spotify 클라이언트 초기화 실패: {e}.")
    
    spotify_client = None

# ====== Pydantic 모델 정의 ======
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
    
# 키워드 응답 모델 (점수 포함)
class KeywordItem(BaseModel):
    keyword: str
    relevance_score: float
class KeywordResponse(BaseModel):
    keywords: list[KeywordItem]

class MusicRecommendation(BaseModel):
    artist: str
    track_title: str
    preview_url: str | None = None
    spotify_url: str
class MusicResponse(BaseModel):
    emotion_seed: str
    recommendations: list[MusicRecommendation]

class ConnectionTestResponse(BaseModel):
    status: str
    message: str
    track_info: dict | None = None


# ====== 감정-장르 매핑 함수 ======
def get_genre_from_emotion(emotion_label: str) -> list[str]:
    label = emotion_label.lower().strip()
    mapping = {
        '기쁨': ['pop', 'dance'],
        '슬픔': ['acoustic', 'sad', 'folk'],
        '분노': ['metal', 'rock'],
        '놀람': ['edm', 'r-n-b'],
        '불안': ['ambient', 'chill'],
        '역겨움': ['blues', 'soul'],
        '중립': ['pop', 'classical']
    }
    return mapping.get(label, ['pop'])

# Spotify API 응답을 Pydantic 모델로 변환
def process_recommendations(recommendations: dict, emotion_label: str, seed_str: list | str) -> MusicResponse:
    recommendation_list = []
    display_seed_str = ', '.join(seed_str) if isinstance(seed_str, list) else str(seed_str)
    
    for track in recommendations['tracks']:
        artists = ", ".join([artist['name'] for artist in track['artists']])
        recommendation_list.append(
            MusicRecommendation(
                artist=artists,
                track_title=track['name'],
                preview_url=track['preview_url'],
                spotify_url=track['external_urls']['spotify']
            )
        )
    return MusicResponse(
        emotion_seed=f"'{emotion_label}' 감정에 따른 시드: {display_seed_str}",
        recommendations=recommendation_list
    )

# ====== /test_connection 엔드포인트 (연결 테스트) ======
@app.get("/test_connection", response_model=ConnectionTestResponse, summary="Spotify API 연결 테스트")
def test_spotify_connection():
    if spotify_client is None:
        return ConnectionTestResponse(
            status="FAILURE",
            message="Spotify 클라이언트가 초기화되지 않았습니다. 환경 변수를 확인하세요.",
            track_info=None
        )
    # 성공이 확인된 트랙 ID
    TEST_TRACK_ID = "11dFghVXANMlKmJXsNCbNl"

    try:
        track = spotify_client.track(TEST_TRACK_ID)
        
        track_info = {
            "title": track['name'],
            "artist": ", ".join([a['name'] for a in track['artists']]),
            "id": TEST_TRACK_ID
        }

        return ConnectionTestResponse(
            status="SUCCESS",
            message=f"Spotify API 연결 성공 테스트 트랙 정보를 성공적으로 가져왔습니다.",
            track_info=track_info
        )

    except spotipy.SpotifyException as e:
        return ConnectionTestResponse(
            status="API_FAILURE",
            message=f"Spotify API 호출 실패: 오류 코드 {e.http_status}. 메시지: {e.msg}.",
            track_info=None
        )
    except Exception as e:
        return ConnectionTestResponse(
            status="UNKNOWN_ERROR",
            message=f"알 수 없는 오류 발생: {str(e)}",
            track_info=None
        )


# ====== /recommend_music_by_emotion 엔드포인트 (음악 추천) ======
@app.post("/recommend_music_by_emotion", response_model=MusicResponse, summary="특정 감정 레이블로 음악 추천")
def recommend_music_by_emotion(input: EmotionRequest):
    if spotify_client is None:
        raise HTTPException(status_code=503, detail="Spotify client failed to initialize. Check API keys.")

    emotion_label = input.emotion_label
    seed_genres = get_genre_from_emotion(emotion_label) 
    
    # 장르 기반 추천 시도
    try:
        recommendations = spotify_client.recommendations(
            seed_genres=seed_genres, 
            limit=5,
            # market=None을 사용하여 지역 제한 오류 회피 시도
            market=None 
        )
        return process_recommendations(recommendations, emotion_label, seed_genres)

    except spotipy.SpotifyException as e_genre:
        # 장르 기반 실패 시, 트랙 ID 기반 추천으로 전환
        print(f"Warning: Genre seed '{seed_genres}' failed ({e_genre.http_status}). Retrying with fallback track IDs.")
        
        last_error_msg = str(e_genre)

        # 안전한 트랙 ID 리스트를 순회하며 추천 시도
        for track_id in FALLBACK_TRACK_IDS:
            try:
                recommendations = spotify_client.recommendations(
                    seed_tracks=[track_id],
                    limit=5,
                    market=None
                )
                return process_recommendations(recommendations, "Fallback (트랙 ID 기반)", f"Fallback Track ID: {track_id}")

            except spotipy.SpotifyException as e_track:
                last_error_msg = str(e_track)
                print(f"Fallback Track ID {track_id} also failed: {e_track.msg}")
                continue
        
        # 모든 시도가 실패했을 경우 최종 예외 발생
        raise HTTPException(
            status_code=500, 
            detail=f"Spotify API 호출 실패: 장르 시드('{seed_genres}')와 {len(FALLBACK_TRACK_IDS)}개의 대체 트랙 시드 모두 실패했습니다. Spotify 앱 권한(Release Mode 전환)을 확인해 주세요. (마지막 오류: {last_error_msg})"
        )


# ====== /recommend_music 엔드포인트 (일기 텍스트 기반 추천) ======
@app.post("/recommend_music", response_model=MusicResponse, summary="일기 텍스트에서 감정을 분석하여 음악 추천")
def recommend_music(input: TextRequest):
    if spotify_client is None:
        raise HTTPException(status_code=503, detail="Spotify client failed to initialize. Check API keys.")

    try:
        # 텍스트에서 감정 분석
        emotion_result = emotion_classifier(input.text)
        
        if not emotion_result or not isinstance(emotion_result, list) or not emotion_result[0].get("label"):
            emotion_label = '중립'
        else:
            emotion_label = str(emotion_result[0]["label"])
        
        # 분석된 감정으로 추천 함수 호출
        return recommend_music_by_emotion(EmotionRequest(emotion_label=emotion_label))

    except HTTPException:
        # 하위 함수에서 발생한 HTTPException은 그대로 전달
        raise
    except Exception as e:
        # 기타 오류 처리
        raise HTTPException(
            status_code=500, 
            detail=f"텍스트 처리 중 심각한 오류가 발생했습니다. Error: {str(e)}"
        )    
    
# ====== /summarize 엔드포인트 (요약) ======
@app.post("/summarize", response_model=SummaryResponse, summary="텍스트 요약 (KoBART)")
def summarize(input: TextRequest):
    input_text = input.text
    input_ids = summary_tokenizer.encode(input_text, return_tensors="pt")
    output_ids = summary_model.generate(
        input_ids,
        max_length=150,
        min_length=30,
        num_beams=5,
        repetition_penalty=2.0,
        no_repeat_ngram_size=3,
        eos_token_id=1,
        bad_words_ids=[[summary_tokenizer.unk_token_id]],
    )
    output_text = summary_tokenizer.decode(
        output_ids.squeeze().tolist(),
        skip_special_tokens=True
    )
    return {"summary": output_text}


# ====== /analyze 엔드포인트 (감정 분석) ======
@app.post("/analyze", response_model=EmotionResponse, summary="텍스트 감정 분석")
def analyze(diary: TextRequest):
    result = emotion_classifier(diary.text)[0]
    return {
        "label": str(result["label"]),
        "score": result["score"],
        "intensity": round(result["score"] * 100),
    }

# ====== /extract_keywords 엔드포인트 (키워드 추출) ======
@app.post("/extract_keywords", response_model=KeywordResponse, summary="텍스트 키워드 추출 (KeyBERT)")
def extract_keywords(input: TextRequest):
    diary_text = input.text
    
    # KeyBERT를 사용하여 키워드 추출
    keywords_with_scores = keyword_model.extract_keywords(
        docs=diary_text, 
        keyphrase_ngram_range=(1, 4), 
        stop_words=None, 
        top_n=20,
        use_mmr=True,
        diversity=0.5
    )
    
    # 키워드와 점수를 KeywordItem 모델에 맞게 변환
    keywords = [
        KeywordItem(keyword=keyword, relevance_score=score)
        for keyword, score in keywords_with_scores
    ]

    return {"keywords": keywords}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

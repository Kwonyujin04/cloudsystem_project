package com.moodtrack.main.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moodtrack.main.error.AppException;
import com.moodtrack.main.error.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmotionAiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${python.url}")
    private String pythonUrl;

    /**
     * 감정 분석 호출 (/analyze)
     */
    public EmotionResult analyze(String text) {
        String url = pythonUrl + "/analyze";

        log.info("AI 서버에 감정 분석 요청 시작. URL: {}", url);

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<EmotionResult> response =
                    restTemplate.postForEntity(url, request, EmotionResult.class);

            log.info("감정 분석 요청 성공. 결과: {}", response.getBody().getLabel());

            return response.getBody();

        } catch (Exception e) {
            log.error("Python 감정 분석 실패. URL: {}", url, e);
            throw new AppException(ErrorCode.HF_API_ERROR, "감정 분석 서버 호출 실패");
        }
    }

    /**
     * 요약 호출 (/summarize)
     */
    public SummaryResult summarize(String text) {
        String url = pythonUrl + "/summarize";

        log.info("AI 서버에 요약 요청 시작. URL: {}", url);

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<SummaryResult> response =
                    restTemplate.postForEntity(url, request, SummaryResult.class);

            log.info("요약 요청 성공. 결과 길이: {}", response.getBody().getSummary().length());

            return response.getBody();

        } catch (Exception e) {
            log.error("Python 요약 실패. URL: {}", url, e);
            throw new AppException(ErrorCode.HF_API_ERROR, "요약 서버 호출 실패");
        }
    }

    /**
     * 키워드 추출 호출 (/extract_keywords)
     */
    public KeywordResult extractKeywords(String text) {
        String url = pythonUrl + "/extract_keywords";

        log.info("AI 서버에 키워드 추출 요청 시작. URL: {}", url);

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<KeywordApiResponse> response =
                    restTemplate.postForEntity(url, request, KeywordApiResponse.class);

            List<KeywordItem> keywordItems = response.getBody().getKeywords();

            List<String> keywordStrings = keywordItems.stream()
                    .map(KeywordItem::getKeyword)
                    .toList();

            KeywordResult finalResult = new KeywordResult();
            finalResult.setKeywords(keywordStrings);

            log.info("키워드 추출 요청 성공. 추출된 키워드 개수: {}", keywordStrings.size());

            return finalResult;

        } catch (HttpClientErrorException e) {
            log.error("Python 키워드 추출 실패. URL: {}", url, e);
            throw new AppException(ErrorCode.HF_API_ERROR, "키워드 추출 서버 호출 실패");
        }
    }

    /**
     * 노래 추천 호출 (/recommend_music)
     */
    public MusicResponse recommendMusic(String text) {
        String url = pythonUrl + "/recommend_music";

        log.info("AI 서버에 음악 추천 요청 시작. URL: {}", url);

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<MusicResponse> response =
                    restTemplate.postForEntity(url, request, MusicResponse.class);

            log.info("음악 추천 요청 성공. 추천된 곡 개수: {}", response.getBody().getRecommendations().size());

            return response.getBody();

        } catch (HttpClientErrorException e) {
            log.error("Python 음악 추천 실패 (HTTP 에러). URL: {}", url, e);
            throw new AppException(ErrorCode.HF_API_ERROR, "음악 추천 서버 호출 실패");
        } catch (Exception e) {
            log.error("Python 음악 추천 실패 (기타 에러). URL: {}", url, e);
            throw new AppException(ErrorCode.HF_API_ERROR, "음악 추천 서버 호출 실패");
        }
    }

    @Data
    public static class MusicResult {
        private String artist;

        @JsonProperty("track_title")
        private String trackTitle;

        @JsonProperty("cover_url")
        private String coverUrl;

        @JsonProperty("spotify_url")
        private String spotifyUrl;
    }

    @Data
    public static class MusicResponse {
        private String emotionSeed;
        private List<MusicResult> recommendations;
    }

    @Data
    public static class EmotionResult {
        private String label;
        private double score;
        private int intensity;
    }

    @Data
    public static class SummaryResult {
        private String summary;
    }

    @Data
    public static class KeywordResult {
        private List<String> keywords;
    }

    @Data
    public static class KeywordApiResponse {
        private List<KeywordItem> keywords;
    }

    @Data
    public static class KeywordItem {
        private String keyword;
        private double relevanceScore;
    }
}
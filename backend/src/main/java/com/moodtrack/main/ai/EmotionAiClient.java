package com.moodtrack.main.ai;

import com.moodtrack.main.error.AppException;
import com.moodtrack.main.error.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
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

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<EmotionResult> response =
                    restTemplate.postForEntity(url, request, EmotionResult.class);

            return response.getBody();

        } catch (Exception e) {
            log.error("Python 감정 분석 실패", e);
            throw new AppException(ErrorCode.HF_API_ERROR, "감정 분석 서버 호출 실패");
        }
    }

    /**
     * 요약 호출 (/summarize)
     */
    public SummaryResult summarize(String text) {
        String url = pythonUrl + "/summarize";

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        try {
            ResponseEntity<SummaryResult> response =
                    restTemplate.postForEntity(url, request, SummaryResult.class);

            return response.getBody();

        } catch (Exception e) {
            log.error("Python 요약 실패", e);
            throw new AppException(ErrorCode.HF_API_ERROR, "요약 서버 호출 실패");
        }
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
}

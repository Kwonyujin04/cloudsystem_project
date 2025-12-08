package com.moodtrack.main.service;

import com.moodtrack.main.ai.EmotionAiClient;
import com.moodtrack.main.dto.DiaryItemResponse;
import com.moodtrack.main.dto.DiaryStatsResponse;
import com.moodtrack.main.dto.DiarySubmitResponse;
import com.moodtrack.main.entity.Diary;
import com.moodtrack.main.entity.Music;
import com.moodtrack.main.entity.User;
import com.moodtrack.main.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final EmotionAiClient emotionAiClient;
    private final DiaryRepository diaryRepository;

    private static final Map<String, String> EMOTION_MAP = Map.of(
            "0", "공포",
            "1", "놀람",
            "2", "분노",
            "3", "슬픔",
            "4", "중립",
            "5", "행복",
            "6", "혐오"
    );

    // 내 일기 전체 조회
    @Transactional(readOnly = true)
    public Page<DiaryItemResponse> getMyDiaries(User user, Pageable pageable) {
        var diaryPage = diaryRepository.findByUserOrderByCreatedAtDescWithMusic(user, pageable);

        return diaryPage.map(diary -> DiaryItemResponse.builder()
                .id(diary.getId())
                .content(diary.getContent())
                .label(diary.getLabel())
                .score(diary.getScore())
                .intensity(diary.getIntensity())
                .summary(diary.getSummary())
                .keywords(diary.getKeywords())
                .musicTitles(diary.getMusicList().stream()
                        .map(Music::getTrackTitle)
                        .collect(Collectors.toList()))
                .musicArtists(diary.getMusicList().stream()
                        .map(Music::getArtist)
                        .collect(Collectors.toList()))
                .musicCovers(diary.getMusicList().stream()
                        .map(Music::getCoverUrl)
                        .collect(Collectors.toList()))
                .musicUrls(diary.getMusicList().stream()
                        .map(Music::getSpotifyUrl)
                        .collect(Collectors.toList()))
                .createdAt(diary.getCreatedAt())
                .build());
    }

    // 최근 7일간 감정 통계 조회
    @Transactional(readOnly = true)
    public DiaryStatsResponse getWeeklyStats(User user) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(6); // 최근 7일

        var diaries = diaryRepository.findDiariesBetween(user, start.withHour(0).withMinute(0), end);

        return buildStatsResponse(start, end, diaries);
    }

    // 최근 1달간 감정 통계 조회
    @Transactional(readOnly = true)
    public DiaryStatsResponse getMonthlyStats(User user) {
        LocalDateTime end = LocalDateTime.now();

        // 이번 달 1일부터 오늘까지
        LocalDateTime start = end.withDayOfMonth(1).withHour(0).withMinute(0);

        var diaries = diaryRepository.findDiariesBetween(user, start, end);

        return buildStatsResponse(start, end, diaries);
    }

    // 공통 통계 계산 메서드
    private DiaryStatsResponse buildStatsResponse(LocalDateTime start, LocalDateTime end, List<Diary> diaries) {

        long total = diaries.size();

        Map<String, Long> emotionCount =
                diaries.stream()
                        .collect(Collectors.groupingBy(Diary::getLabel, Collectors.counting()));

        String dominantEmotion = emotionCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("없음");

        return DiaryStatsResponse.builder()
                .range(start.toLocalDate() + " ~ " + end.toLocalDate())
                .total(total)
                .emotionCount(emotionCount)
                .dominantEmotion(dominantEmotion)
                .build();
    }

    // 감정 분석 및 요약 후 일기 제출
    @Transactional
    public DiarySubmitResponse submitDiary(User user, String content) {

        // 1) 파이썬 감정 분석 API 호출
        var emotionResult = emotionAiClient.analyze(content);
        String emotionLabel = EMOTION_MAP.getOrDefault(emotionResult.getLabel(), "정보 없음");

        // 2) 파이썬 요약 API 호출
        var summaryResult = emotionAiClient.summarize(content);
        String summaryText = summaryResult.getSummary();

        // 3) 파이썬 키워드 추출 API 호출
        var keywordResult = emotionAiClient.extractKeywords(content);
        List<String> keywords = keywordResult.getKeywords();

        // 4) 파이썬 음악 추천 API 호출
        EmotionAiClient.MusicResponse musicResponse = emotionAiClient.recommendMusic(content);
        List<EmotionAiClient.MusicResult> musicRecommendations = musicResponse.getRecommendations();

        // 5) 일기 DB에 저장
        Diary diary = Diary.builder()
                .user(user)
                .content(content)
                .summary(summaryText)
                .label(emotionLabel)
                .score(emotionResult.getScore())
                .intensity(emotionResult.getIntensity())
                .keywords(keywords)
                .createdAt(LocalDateTime.now())
                .build();

        List<Music> musicList = musicRecommendations.stream().map(musicRecommendation -> {
            Music music = new Music();
            music.setArtist(musicRecommendation.getArtist());
            music.setTrackTitle(musicRecommendation.getTrackTitle());
            music.setCoverUrl(musicRecommendation.getCoverUrl());
            music.setSpotifyUrl(musicRecommendation.getSpotifyUrl());
            music.setDiary(diary);
            return music;
        }).collect(Collectors.toList());

        diary.setMusicList(musicList);

        diaryRepository.save(diary);

        // 5) 클라이언트에 분석 결과 + 요약 + 키워드 반환
        List<String> musicTitles = musicRecommendations.stream()
                .map(EmotionAiClient.MusicResult::getTrackTitle)
                .collect(Collectors.toList());

        List<String> musicArtists = musicRecommendations.stream()
                .map(EmotionAiClient.MusicResult::getArtist)
                .collect(Collectors.toList());

        List<String> musicCovers = musicRecommendations.stream()
                .map(EmotionAiClient.MusicResult::getCoverUrl)
                .collect(Collectors.toList());

        List<String> musicUrls = musicRecommendations.stream()
                .map(EmotionAiClient.MusicResult::getSpotifyUrl)
                .collect(Collectors.toList());

        return DiarySubmitResponse.builder()
                .diaryId(diary.getId())
                .label(emotionLabel)
                .score(emotionResult.getScore())
                .intensity(emotionResult.getIntensity())
                .summary(summaryText)
                .keywords(keywords)
                .musicTitles(musicTitles)
                .musicArtists(musicArtists)
                .musicCovers(musicCovers)
                .musicUrls(musicUrls)
                .build();
    }
}


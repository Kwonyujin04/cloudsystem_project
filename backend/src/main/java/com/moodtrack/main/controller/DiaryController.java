package com.moodtrack.main.controller;

import com.moodtrack.main.dto.*;
import com.moodtrack.main.entity.User;
import com.moodtrack.main.error.AppException;
import com.moodtrack.main.error.ErrorCode;
import com.moodtrack.main.repository.UserRepository;
import com.moodtrack.main.service.DiaryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;
    private final UserRepository userRepository;

    // 🔐 JWT 인증된 사용자 가져오기 (SecurityContext에서)
    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        // principal 이 String인 상황
        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
    }

    // 내 일기 목록 조회
    @GetMapping("/info")
    public ApiResponse<PageResponse<DiaryItemResponse>> getMyDiaries(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        User user = getCurrentUser();
        var page = diaryService.getMyDiaries(user, pageable);
        return ApiResponse.ok(PageResponse.from(page), "내 일기 목록 조회에 성공했습니다.");
    }

    // 최근 7일간 감정 통계 조회
    @GetMapping("/stats/weekly")
    public ApiResponse<DiaryStatsResponse> getWeeklyStats() {
        User user = getCurrentUser();
        return ApiResponse.ok(diaryService.getWeeklyStats(user), "최근 7일간 감정 통계 조회에 성공했습니다.");
    }

    // 최근 30일간 감정 통계 조회
    @GetMapping("/stats/monthly")
    public ApiResponse<DiaryStatsResponse> getMonthlyStats() {
        User user = getCurrentUser();
        return ApiResponse.ok(diaryService.getMonthlyStats(user), "최근 30일간 감정 통계 조회에 성공했습니다.");
    }

    // 일기 감정 분석 및 요약
    @PostMapping("/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public DiarySubmitResponse submitDiary(HttpServletRequest request,
                                           @RequestBody DiarySubmitRequest req) {

        // 현재 요청의 유저 찾기
        User user = getCurrentUser();
        String content = req.getContent();
        LocalDate date = req.getSelectedDate();
        return diaryService.submitDiary(user, content, date);
    }
}

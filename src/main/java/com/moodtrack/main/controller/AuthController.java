package com.moodtrack.main.controller;

import com.moodtrack.main.auth.JwtUtil;
import com.moodtrack.main.dto.ApiResponse;
import com.moodtrack.main.dto.LoginRequest;
import com.moodtrack.main.dto.LoginResponse;
import com.moodtrack.main.dto.SignupRequest;
import com.moodtrack.main.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("회원가입 시도: {}", request.getEmail());
        userService.signup(request); // 예외 발생 시 GlobalExceptionHandler가 응답 생성
        return ResponseEntity.ok(ApiResponse.msg("회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("로그인 시도: {}", request.getEmail());
        LoginResponse res = userService.login(request);
        String token = jwtUtil.generateToken(request.getEmail());
        res.setToken(token);
        return ResponseEntity.ok(ApiResponse.ok(res, "로그인 성공"));
    }

    @GetMapping("/test")
    public String test() {
        return "AuthController is working!";
    }
}

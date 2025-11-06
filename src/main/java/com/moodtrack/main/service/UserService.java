package com.moodtrack.main.service;

import com.moodtrack.main.dto.LoginRequest;
import com.moodtrack.main.dto.LoginResponse;
import com.moodtrack.main.dto.SignupRequest;
import com.moodtrack.main.entity.User;
import com.moodtrack.main.error.*;
import com.moodtrack.main.error.ErrorCode;
import com.moodtrack.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /** 회원가입 */
    @Transactional
    public void signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail())
                .build();

        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException race) {
            // 동시 가입 레이스 컨디션 대비 (유니크 인덱스 충돌)
            throw new AppException(ErrorCode.DATA_INTEGRITY);
        }
        log.info("회원가입 완료: {}", user.getUsername());
    }

    /** 로그인 */
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean ok = passwordEncoder.matches(req.getPassword(), user.getPassword());
        if (!ok) throw new AppException(ErrorCode.INVALID_PASSWORD);

        return LoginResponse.builder()
                .build();
    }
}

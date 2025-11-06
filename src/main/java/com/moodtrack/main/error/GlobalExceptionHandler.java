package com.moodtrack.main.error;

import com.moodtrack.main.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<ApiResponse<Void>> buildResponse(ErrorCode code, String message, String path) {
        ApiResponse<Void> response = ApiResponse.error(code);
        if (message != null) {
            response = ApiResponse.error(code, message); // message가 있으면 포함
        }
        return ResponseEntity.status(code.getStatus()).body(response);
    }

    /** 커스텀 예외 */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleApp(AppException ex, HttpServletRequest req) {
        log.warn("[APP] {} - {}", ex.getCode(), ex.getMessage());
        return buildResponse(ex.getCode(), ex.getMessage(), req.getRequestURI());
    }

    /** valid 바디 검증 실패 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValid(MethodArgumentNotValidException ex, HttpServletRequest req) {
        // errorMessage를 빈 문자열로 초기화
        StringBuilder errorMessage = new StringBuilder();

        // 각 필드 오류 메시지를 가져와서 출력
        ex.getBindingResult().getFieldErrors().stream()
                .filter(fe -> fe.getDefaultMessage() != null)  // 메시지가 null이 아닌 경우만 필터링
                .map(fe -> {
                    String defaultMessage = fe.getDefaultMessage();

                    // @NotBlank 메시지 처리 (먼저 출력)
                    if (defaultMessage.contains("필수")) {
                        if (errorMessage.toString().contains("사용자명은 필수 입력입니다.")) {
                            return null; // 필수 입력 메시지가 이미 있으면 중복 처리 방지
                        }
                        return defaultMessage; // 필드와 메시지 연결
                    }
                    // @Size 메시지 처리 (이전 @NotBlank 메시지가 있으면 생략)
                    else if (defaultMessage.contains("이상")) {
                        if (errorMessage.toString().contains("사용자명은 필수 입력입니다.")) {
                            return null; // 필수 입력 메시지가 이미 있으면 중복 처리 방지
                        }
                        return defaultMessage; // 필드와 메시지 연결
                    }
                    // @Email 메시지 처리
                    else if (defaultMessage.equals("유효한 이메일 주소를 입력해주세요.")) {
                        return defaultMessage; // 이메일 형식 오류 메시지 처리
                    }
                    return null; // 그 외 메시지들은 null 처리
                })
                .filter(Objects::nonNull)  // null 값을 제거
                .distinct()  // 중복 제거
                .forEach(msg -> errorMessage.append(msg).append(", "));  // 메시지 연결

        // 끝에 ", "를 잘라냄
        if (errorMessage.length() > 0) {
            errorMessage.setLength(errorMessage.length() - 2); // 마지막 콤마 제거
        }

        // 결과 반환
        return buildResponse(ErrorCode.VALIDATION_ERROR, errorMessage.toString(), req.getRequestURI());
    }


    /** Validated 파라미터/패스 검증 실패 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraint(ConstraintViolationException ex, HttpServletRequest req) {
        // constraintViolation 에러 메시지 반환
        return buildResponse(ErrorCode.VALIDATION_ERROR, ex.getMessage(), req.getRequestURI());
    }

    /** DB 유니크 충돌 등 (동시성 레이스 대비) */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        log.warn("[DB] {}", ex.getMessage());
        return buildResponse(ErrorCode.DATA_INTEGRITY, "데이터 무결성 오류 발생", req.getRequestURI());
    }

    /** HTTP 메서드가 지원되지 않는 경우 */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        return buildResponse(ErrorCode.METHOD_NOT_SUPPORTED, ex.getMessage(), null);
    }

    /** 최후의 보루 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleEtc(Exception ex, HttpServletRequest req) {
        log.error("[UNCAUGHT] {}", ex.getMessage(), ex);
        return buildResponse(ErrorCode.INTERNAL_ERROR, "서버에서 예기치 못한 오류가 발생했습니다.", req.getRequestURI());
    }
}

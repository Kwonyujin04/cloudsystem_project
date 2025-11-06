package com.moodtrack.main.dto;

import com.moodtrack.main.error.ErrorCode;
import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;

    public static <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse
                .<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> msg(String message) {
        return ApiResponse
                .<T>builder()
                .success(true)
                .data(null)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return ApiResponse
                .<T>builder()
                .success(false)
                .data(null)
                .message(errorCode.getDefaultMessage())
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse
                .<T>builder()
                .success(false)
                .data(null)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String message) {
        return ApiResponse
                .<T>builder()
                .success(false)
                .data(null)
                .message(message != null ? message : errorCode.getDefaultMessage())
                .build();
    }
}

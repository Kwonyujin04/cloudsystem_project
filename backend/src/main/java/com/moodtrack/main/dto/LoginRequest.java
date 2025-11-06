package com.moodtrack.main.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    private String password;
}

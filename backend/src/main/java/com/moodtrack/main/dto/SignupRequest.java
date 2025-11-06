package com.moodtrack.main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "사용자명은 필수 입력입니다.")
    @Size(min = 2, max = 20, message = "사용자명은 2자 이상, 20자 이하로 입력해야 합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    @Size(min = 6, max = 40, message = "비밀번호는 6자 이상, 40자 이하로 입력해야 합니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    @Size(max = 50, message = "이메일은 최대 50자까지 입력할 수 있습니다.")
    private String email;
}

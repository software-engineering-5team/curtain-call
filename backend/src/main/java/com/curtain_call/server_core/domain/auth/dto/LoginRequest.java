package com.curtain_call.server_core.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "idToken은 필수입니다.")
    private String idToken;
}

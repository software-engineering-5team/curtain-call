package com.curtain_call.server_core.domain.auth.controller;

import com.curtain_call.server_core.domain.auth.dto.LoginRequest;
import com.curtain_call.server_core.domain.auth.dto.LoginResponse;
import com.curtain_call.server_core.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // TODO: 구글 토큰 검증, @kookmin.ac.kr 도메인 체크 및 JWT 발급 로직 구현
        return ResponseEntity.ok(LoginResponse.builder().build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // TODO: 로그아웃 (토큰 무효화) 로직
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse.UserDto> getMe() {
        // TODO: 현재 로그인된 사용자 정보 반환 로직
        return ResponseEntity.ok(LoginResponse.UserDto.builder().build());
    }
}

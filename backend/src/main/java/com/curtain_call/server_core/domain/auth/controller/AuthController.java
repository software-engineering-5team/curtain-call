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
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT 기반에서는 클라이언트에서 토큰을 삭제하며, 서버측 블랙리스트 처리는 선택 사항입니다.
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse.UserDto> getMe() {
        // SecurityContextHolder에서 userId 추출 (JwtAuthenticationFilter에서 등록됨)
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(authService.getMe(userId));
    }
}

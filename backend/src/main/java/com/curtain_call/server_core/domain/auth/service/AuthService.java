package com.curtain_call.server_core.domain.auth.service;

import com.curtain_call.server_core.domain.auth.dto.LoginRequest;
import com.curtain_call.server_core.domain.auth.dto.LoginResponse;
import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import com.curtain_call.server_core.global.security.jwt.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleAuthService googleAuthService;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        GoogleIdToken.Payload payload = googleAuthService.verify(request.getIdToken());
        if (payload == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 Google 토큰입니다.");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // 도메인 검증: @kookmin.ac.kr 확인
        if (!email.endsWith("@kookmin.ac.kr")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "국민대학교 계정(@kookmin.ac.kr)만 접근 가능합니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.create(email, name)));

        String accessToken = jwtTokenProvider.createToken(user.getId(), user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .user(LoginResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .build())
                .build();
    }

    public LoginResponse.UserDto getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return LoginResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}

package com.curtain_call.server_core.domain.auth.service;

import com.curtain_call.server_core.domain.auth.dto.LoginRequest;
import com.curtain_call.server_core.domain.auth.dto.LoginResponse;
import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import com.curtain_call.server_core.global.security.jwt.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GoogleAuthService googleAuthService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("로그인 성공 - 기존 사용자")
    void login_Success_ExistingUser() {
        // given
        String tokenString = "valid.google.token";
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "idToken", tokenString);

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("test@kookmin.ac.kr");
        payload.set("name", "Test User");
        given(googleAuthService.verify(tokenString)).willReturn(payload);

        User existingUser = mock(User.class);
        given(existingUser.getId()).willReturn(1L);
        given(existingUser.getEmail()).willReturn("test@kookmin.ac.kr");
        given(existingUser.getName()).willReturn("Test User");

        given(userRepository.findByEmail("test@kookmin.ac.kr")).willReturn(Optional.of(existingUser));
        given(jwtTokenProvider.createToken(1L, "test@kookmin.ac.kr")).willReturn("mock.jwt.token");

        // when
        LoginResponse response = authService.login(request);

        // then
        assertThat(response.getAccessToken()).isEqualTo("mock.jwt.token");
        assertThat(response.getUser().getEmail()).isEqualTo("test@kookmin.ac.kr");
    }

    @Test
    @DisplayName("로그인 실패 - 유효하지 않은 구글 토큰")
    void login_Fail_InvalidToken() {
        // given
        String tokenString = "invalid.token";
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "idToken", tokenString);

        given(googleAuthService.verify(tokenString)).willReturn(null);

        // when & then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("유효하지 않은 Google 토큰");
    }

    @Test
    @DisplayName("로그인 실패 - 허용되지 않은 이메일 도메인")
    void login_Fail_ForbiddenDomain() {
        // given
        String tokenString = "valid.google.token";
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "idToken", tokenString);

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("test@gmail.com");
        payload.set("name", "Test User");
        given(googleAuthService.verify(tokenString)).willReturn(payload);

        // when & then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("국민대학교 계정(@kookmin.ac.kr)만 접근 가능합니다");
    }

    @Test
    @DisplayName("내 정보 조회 성공")
    void getMe_Success() {
        // given
        Long userId = 1L;
        User user = mock(User.class);
        given(user.getId()).willReturn(userId);
        given(user.getEmail()).willReturn("test@kookmin.ac.kr");
        given(user.getName()).willReturn("Test User");

        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // when
        LoginResponse.UserDto response = authService.getMe(userId);

        // then
        assertThat(response.getId()).isEqualTo(userId);
        assertThat(response.getEmail()).isEqualTo("test@kookmin.ac.kr");
    }
}

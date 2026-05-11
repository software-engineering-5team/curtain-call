package com.curtain_call.server_core.domain.auth.service;

import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;

    // TODO: 구글 OAuth2 토큰 검증 로직 및 JWT 발급
}

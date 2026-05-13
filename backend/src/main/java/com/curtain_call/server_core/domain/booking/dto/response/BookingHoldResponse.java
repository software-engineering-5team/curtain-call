package com.curtain_call.server_core.domain.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookingHoldResponse {
    private String holdToken;
    private LocalDateTime expiresAt;
}

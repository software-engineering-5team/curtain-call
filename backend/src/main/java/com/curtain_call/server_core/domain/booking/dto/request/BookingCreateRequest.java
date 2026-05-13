package com.curtain_call.server_core.domain.booking.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BookingCreateRequest {
    private String holdToken;
    private Long performanceId;
    private List<Long> seatIds;
}

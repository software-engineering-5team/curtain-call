package com.curtain_call.server_core.domain.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PerformanceBookingStatusResponse {
    private Long performanceId;
    private Integer totalSeats;
    private Integer availableSeats;
    private Integer confirmedBookings;
}

package com.curtain_call.server_core.domain.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PerformanceBookingStatusResponse {
    private Integer totalBooked;
    private List<BookingResponse> bookings;
}

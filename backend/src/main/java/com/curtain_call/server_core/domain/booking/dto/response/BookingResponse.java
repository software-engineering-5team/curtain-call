package com.curtain_call.server_core.domain.booking.dto.response;

import com.curtain_call.server_core.domain.booking.entity.BookingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class BookingResponse {
    private Long bookingId;
    private Long performanceId;
    private String performanceTitle;
    private List<String> seats;
    private BookingStatus status;
    private LocalDateTime bookedAt;
}

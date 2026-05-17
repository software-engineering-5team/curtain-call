package com.curtain_call.server_core.domain.booking.dto.response;

import com.curtain_call.server_core.domain.booking.entity.BookingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookingResponse {
    private Long bookingId;
    private Long performanceId;
    private String performanceTitle;
    private Integer seatCount;
    private BookingStatus status;
    private LocalDateTime createdAt;
}

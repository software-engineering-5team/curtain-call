package com.curtain_call.server_core.domain.booking.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BookingHoldRequest {
    @NotNull
    private Long performanceId;
    @NotEmpty
    private List<Long> seatIds;
}

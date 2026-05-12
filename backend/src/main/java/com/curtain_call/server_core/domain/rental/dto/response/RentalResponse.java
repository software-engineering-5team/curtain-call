package com.curtain_call.server_core.domain.rental.dto.response;

import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class RentalResponse {
    private Long rentalId;
    private String eventName;
    private LocalDate useDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private RentalStatus status;
}

package com.curtain_call.server_core.domain.rental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class RentalCheckRequest {
    @NotNull
    private LocalDate useDate;
    @NotNull
    private LocalTime startTime;
    @NotNull
    private LocalTime endTime;
}

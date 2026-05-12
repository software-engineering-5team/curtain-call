package com.curtain_call.server_core.domain.seat.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SeatCreateRequest {
    @NotNull
    private Long templateId;
    @NotNull
    private Integer rows;
    @NotNull
    private Integer cols;
    private List<String> disabledSeats;
}

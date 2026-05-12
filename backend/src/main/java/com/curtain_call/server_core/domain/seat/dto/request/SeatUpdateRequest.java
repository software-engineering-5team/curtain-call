package com.curtain_call.server_core.domain.seat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SeatUpdateRequest {
    private List<String> disabledSeats;
}

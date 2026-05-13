package com.curtain_call.server_core.domain.seat.dto.response;

import com.curtain_call.server_core.domain.seat.entity.SeatStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SeatStatusResponse {
    private Long seatId;
    private String rowNum;
    private Integer colNum;
    private String label;
    private SeatStatus status;
}

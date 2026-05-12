package com.curtain_call.server_core.domain.seat.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SeatTemplateResponse {
    private Long templateId;
    private String name;
    private Integer rows;
    private Integer cols;
    private String layout;
}

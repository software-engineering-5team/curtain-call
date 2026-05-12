package com.curtain_call.server_core.domain.performance.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PerformanceResponse {
    private Long performanceId;
    private String title;
    private String description;
    private String posterImageUrl;
    private LocalDateTime bookingStartAt;
    private LocalDateTime bookingEndAt;
    private Integer totalSeats;
    private Integer availableSeats;
}

package com.curtain_call.server_core.domain.performance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class PerformanceCreateRequest {
    @NotNull
    private Long rentalId;
    @NotBlank
    private String title;
    private String description;
    private String posterImageUrl;
    @NotNull
    private LocalDateTime bookingStartAt;
    @NotNull
    private LocalDateTime bookingEndAt;
}

package com.curtain_call.server_core.domain.rental.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RentalCheckResponse {
    private boolean available;
    private List<RentalResponse> conflicts;
}

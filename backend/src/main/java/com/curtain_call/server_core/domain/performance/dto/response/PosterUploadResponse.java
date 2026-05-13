package com.curtain_call.server_core.domain.performance.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PosterUploadResponse {
    private String imageUrl;
}

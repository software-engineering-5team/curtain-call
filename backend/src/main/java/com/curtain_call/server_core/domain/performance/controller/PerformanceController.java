package com.curtain_call.server_core.domain.performance.controller;

import com.curtain_call.server_core.domain.performance.dto.request.PerformanceCreateRequest;
import com.curtain_call.server_core.domain.performance.dto.request.PerformanceUpdateRequest;
import com.curtain_call.server_core.domain.performance.dto.response.PerformanceResponse;
import com.curtain_call.server_core.domain.performance.dto.response.PosterUploadResponse;
import com.curtain_call.server_core.domain.performance.service.PerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/performances")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    @PostMapping
    public ResponseEntity<PerformanceResponse> createPerformance(
            @Valid @RequestBody PerformanceCreateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(performanceService.createPerformance(userId, request));
    }

    @PostMapping("/upload-poster")
    public ResponseEntity<PosterUploadResponse> uploadPoster(@RequestParam("file") MultipartFile file) {
        String imageUrl = performanceService.uploadPoster(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(PosterUploadResponse.builder().imageUrl(imageUrl).build());
    }

    @PutMapping("/{performanceId}")
    public ResponseEntity<PerformanceResponse> updatePerformance(
            @PathVariable Long performanceId,
            @Valid @RequestBody PerformanceUpdateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(performanceService.updatePerformance(userId, performanceId, request));
    }

    @GetMapping
    public ResponseEntity<Page<PerformanceResponse>> getPerformances(Pageable pageable) {
        return ResponseEntity.ok(performanceService.getPerformances(pageable));
    }

    @GetMapping("/{performanceId}")
    public ResponseEntity<PerformanceResponse> getPerformanceDetail(@PathVariable Long performanceId) {
        return ResponseEntity.ok(performanceService.getPerformanceDetail(performanceId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<PerformanceResponse>> getMyPerformances(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(performanceService.getMyPerformances(userId));
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}

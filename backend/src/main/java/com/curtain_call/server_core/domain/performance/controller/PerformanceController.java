package com.curtain_call.server_core.domain.performance.controller;

import com.curtain_call.server_core.domain.performance.dto.request.PerformanceCreateRequest;
import com.curtain_call.server_core.domain.performance.dto.request.PerformanceUpdateRequest;
import com.curtain_call.server_core.domain.performance.dto.response.PerformanceResponse;
import com.curtain_call.server_core.domain.performance.dto.response.PosterUploadResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/performances")
public class PerformanceController {

    @PostMapping
    public ResponseEntity<PerformanceResponse> createPerformance(@Valid @RequestBody PerformanceCreateRequest request) {
        // TODO: 공연 정보 등록 로직 (확정된 대여 내역 검증)
        return ResponseEntity.status(HttpStatus.CREATED).body(PerformanceResponse.builder().build());
    }

    @PostMapping("/upload-poster")
    public ResponseEntity<PosterUploadResponse> uploadPoster(@RequestParam("file") MultipartFile file) {
        // TODO: 포스터 이미지 업로드 로직 구성
        return ResponseEntity.status(HttpStatus.CREATED).body(PosterUploadResponse.builder().imageUrl("dummy-url").build());
    }

    @PutMapping("/{performanceId}")
    public ResponseEntity<PerformanceResponse> updatePerformance(
            @PathVariable Long performanceId,
            @Valid @RequestBody PerformanceUpdateRequest request) {
        // TODO: 공연 정보 수정 로직
        return ResponseEntity.ok(PerformanceResponse.builder().performanceId(performanceId).build());
    }

    @GetMapping
    public ResponseEntity<Page<PerformanceResponse>> getPerformances(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        // TODO: 공연 목록 전체 조회 (페이징 적용)
        return ResponseEntity.ok(new PageImpl<>(Collections.emptyList(), pageable, 0));
    }

    @GetMapping("/{performanceId}")
    public ResponseEntity<PerformanceResponse> getPerformanceDetail(@PathVariable Long performanceId) {
        // TODO: 공연 상세 조회 (잔여 좌석 수 포함)
        return ResponseEntity.ok(PerformanceResponse.builder().performanceId(performanceId).build());
    }

    @GetMapping("/me")
    public ResponseEntity<List<PerformanceResponse>> getMyPerformances() {
        // TODO: 내 공연(주최) 목록 조회
        return ResponseEntity.ok(Collections.emptyList());
    }
}

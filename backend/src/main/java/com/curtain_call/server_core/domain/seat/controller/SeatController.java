package com.curtain_call.server_core.domain.seat.controller;

import com.curtain_call.server_core.domain.seat.dto.request.SeatCreateRequest;
import com.curtain_call.server_core.domain.seat.dto.request.SeatUpdateRequest;
import com.curtain_call.server_core.domain.seat.dto.response.SeatStatusResponse;
import com.curtain_call.server_core.domain.seat.dto.response.SeatTemplateResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SeatController {

    @GetMapping("/seat-templates")
    public ResponseEntity<List<SeatTemplateResponse>> getSeatTemplates() {
        // TODO: 좌석 기본 템플릿 목록 조회
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/performances/{performanceId}/seats")
    public ResponseEntity<Void> createSeats(
            @PathVariable Long performanceId,
            @Valid @RequestBody SeatCreateRequest request) {
        // TODO: 특정 공연의 좌석 배치 생성
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/performances/{performanceId}/seats")
    public ResponseEntity<Void> updateSeats(
            @PathVariable Long performanceId,
            @Valid @RequestBody SeatUpdateRequest request) {
        // TODO: 좌석 배치 수정 (예매 시작 전 검증)
        return ResponseEntity.ok().build();
    }

    @GetMapping("/performances/{performanceId}/seats")
    public ResponseEntity<List<SeatStatusResponse>> getSeatsStatus(@PathVariable Long performanceId) {
        // TODO: 실시간 좌석 상태 조회 (AVAILABLE / SELECTING / RESERVED / UNAVAILABLE)
        return ResponseEntity.ok(Collections.emptyList());
    }
}

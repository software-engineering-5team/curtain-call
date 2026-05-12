package com.curtain_call.server_core.domain.rental.controller;

import com.curtain_call.server_core.domain.rental.dto.request.RentalCheckRequest;
import com.curtain_call.server_core.domain.rental.dto.request.RentalCreateRequest;
import com.curtain_call.server_core.domain.rental.dto.response.RentalCheckResponse;
import com.curtain_call.server_core.domain.rental.dto.response.RentalResponse;
import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(@Valid @RequestBody RentalCreateRequest request) {
        // TODO: 시간 중복 검증 및 즉시 확정 대여 신청 로직
        return ResponseEntity.status(HttpStatus.CREATED).body(RentalResponse.builder().status(RentalStatus.CONFIRMED).build());
    }

    @GetMapping("/check")
    public ResponseEntity<RentalCheckResponse> checkTimeConflict(@ModelAttribute RentalCheckRequest request) {
        // TODO: 대여 시간 사전 검증 로직
        return ResponseEntity.ok(RentalCheckResponse.builder().available(true).conflicts(Collections.emptyList()).build());
    }

    @GetMapping
    public ResponseEntity<List<RentalResponse>> getRentals(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        // TODO: 대여 일정 전체 조회 (캘린더 표시용)
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{rentalId}")
    public ResponseEntity<RentalResponse> getRentalDetail(@PathVariable Long rentalId) {
        // TODO: 대여 상세 조회
        return ResponseEntity.ok(RentalResponse.builder().rentalId(rentalId).build());
    }

    @GetMapping("/me")
    public ResponseEntity<List<RentalResponse>> getMyRentals() {
        // TODO: 내 대여 신청 내역 조회
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PatchMapping("/{rentalId}/cancel")
    public ResponseEntity<RentalResponse> cancelRental(@PathVariable Long rentalId) {
        // TODO: 대여 소프트 취소 (본인 소유 검증)
        return ResponseEntity.ok(RentalResponse.builder().rentalId(rentalId).status(RentalStatus.CANCELLED).build());
    }
}

package com.curtain_call.server_core.domain.booking.controller;

import com.curtain_call.server_core.domain.booking.dto.request.BookingCreateRequest;
import com.curtain_call.server_core.domain.booking.dto.request.BookingHoldRequest;
import com.curtain_call.server_core.domain.booking.dto.response.BookingHoldResponse;
import com.curtain_call.server_core.domain.booking.dto.response.BookingResponse;
import com.curtain_call.server_core.domain.booking.dto.response.PerformanceBookingStatusResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    @PostMapping("/bookings/hold")
    public ResponseEntity<BookingHoldResponse> holdSeats(@Valid @RequestBody BookingHoldRequest request) {
        // TODO: 좌석 임시 선점 (동시성 제어 적용 및 TTL 관리)
        return ResponseEntity.ok(BookingHoldResponse.builder().build());
    }

    @DeleteMapping("/bookings/hold/{holdToken}")
    public ResponseEntity<Void> releaseHold(@PathVariable String holdToken) {
        // TODO: 임시 선점 해제
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        // TODO: 예매 확정 (좌석 충돌 방지 트랜잭션, 1인당 한도 초과 검증)
        return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.builder().build());
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        // TODO: 예매 취소 (공연 시작 전 시간 검증)
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings/me")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam(required = false) String status) {
        // TODO: 내 예매 내역 조회
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingDetail(@PathVariable Long bookingId) {
        // TODO: 예매 상세 조회
        return ResponseEntity.ok(BookingResponse.builder().bookingId(bookingId).build());
    }

    @GetMapping("/performances/{performanceId}/bookings")
    public ResponseEntity<PerformanceBookingStatusResponse> getPerformanceBookings(@PathVariable Long performanceId) {
        // TODO: 공연별 예매 현황 (주최자 전용 조회 권한 검증)
        return ResponseEntity.ok(PerformanceBookingStatusResponse.builder().build());
    }
}

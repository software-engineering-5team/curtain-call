package com.curtain_call.server_core.domain.booking.controller;

import com.curtain_call.server_core.domain.booking.dto.request.BookingCreateRequest;
import com.curtain_call.server_core.domain.booking.dto.request.BookingHoldRequest;
import com.curtain_call.server_core.domain.booking.dto.response.BookingHoldResponse;
import com.curtain_call.server_core.domain.booking.dto.response.BookingResponse;
import com.curtain_call.server_core.domain.booking.dto.response.PerformanceBookingStatusResponse;
import com.curtain_call.server_core.domain.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings/hold")
    public ResponseEntity<BookingHoldResponse> holdSeats(
            @Valid @RequestBody BookingHoldRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bookingService.holdSeats(userId, request));
    }

    @DeleteMapping("/bookings/hold/{holdToken}")
    public ResponseEntity<Void> releaseHold(@PathVariable String holdToken) {
        bookingService.releaseHold(holdToken);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(userId, request));
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        bookingService.cancelBooking(userId, bookingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings/me")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bookingService.getMyBookings(userId, status));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingDetail(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingDetail(bookingId));
    }

    @GetMapping("/performances/{performanceId}/bookings")
    public ResponseEntity<PerformanceBookingStatusResponse> getPerformanceBookings(@PathVariable Long performanceId) {
        return ResponseEntity.ok(bookingService.getPerformanceBookingStatus(performanceId));
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}

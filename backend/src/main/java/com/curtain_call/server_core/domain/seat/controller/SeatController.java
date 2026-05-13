package com.curtain_call.server_core.domain.seat.controller;

import com.curtain_call.server_core.domain.seat.dto.request.SeatCreateRequest;
import com.curtain_call.server_core.domain.seat.dto.request.SeatUpdateRequest;
import com.curtain_call.server_core.domain.seat.dto.response.SeatStatusResponse;
import com.curtain_call.server_core.domain.seat.dto.response.SeatTemplateResponse;
import com.curtain_call.server_core.domain.seat.service.SeatService;
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
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/seat-templates")
    public ResponseEntity<List<SeatTemplateResponse>> getSeatTemplates() {
        return ResponseEntity.ok(seatService.getSeatTemplates());
    }

    @PostMapping("/performances/{performanceId}/seats")
    public ResponseEntity<Void> createSeats(
            @PathVariable Long performanceId,
            @Valid @RequestBody SeatCreateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        seatService.createSeats(userId, performanceId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/performances/{performanceId}/seats")
    public ResponseEntity<Void> updateSeats(
            @PathVariable Long performanceId,
            @Valid @RequestBody SeatUpdateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        seatService.updateSeats(userId, performanceId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/performances/{performanceId}/seats")
    public ResponseEntity<List<SeatStatusResponse>> getSeatsStatus(@PathVariable Long performanceId) {
        return ResponseEntity.ok(seatService.getSeatsStatus(performanceId));
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}

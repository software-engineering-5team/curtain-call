package com.curtain_call.server_core.domain.rental.controller;

import com.curtain_call.server_core.domain.rental.dto.request.RentalCheckRequest;
import com.curtain_call.server_core.domain.rental.dto.request.RentalCreateRequest;
import com.curtain_call.server_core.domain.rental.dto.response.RentalCheckResponse;
import com.curtain_call.server_core.domain.rental.dto.response.RentalResponse;
import com.curtain_call.server_core.domain.rental.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(
            @Valid @RequestBody RentalCreateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(rentalService.createRental(userId, request));
    }

    @GetMapping("/check")
    public ResponseEntity<RentalCheckResponse> checkTimeConflict(@Valid RentalCheckRequest request) {
        return ResponseEntity.ok(rentalService.checkTimeConflict(request));
    }

    @GetMapping
    public ResponseEntity<List<RentalResponse>> getRentals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(rentalService.getRentals(startDate, endDate));
    }

    @GetMapping("/{rentalId}")
    public ResponseEntity<RentalResponse> getRentalDetail(@PathVariable Long rentalId) {
        return ResponseEntity.ok(rentalService.getRentalDetail(rentalId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<RentalResponse>> getMyRentals(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(rentalService.getMyRentals(userId));
    }

    @PatchMapping("/{rentalId}/cancel")
    public ResponseEntity<RentalResponse> cancelRental(
            @PathVariable Long rentalId,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(rentalService.cancelRental(userId, rentalId));
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}

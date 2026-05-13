package com.curtain_call.server_core.domain.booking.repository;

import com.curtain_call.server_core.domain.booking.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findAllByBookingId(Long bookingId);
}

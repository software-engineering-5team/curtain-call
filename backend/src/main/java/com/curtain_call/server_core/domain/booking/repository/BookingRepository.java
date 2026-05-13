package com.curtain_call.server_core.domain.booking.repository;

import com.curtain_call.server_core.domain.booking.entity.Booking;
import com.curtain_call.server_core.domain.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findAllByUserId(Long userId);
    List<Booking> findAllByUserIdAndStatus(Long userId, BookingStatus status);
    List<Booking> findAllByPerformanceId(Long performanceId);
}

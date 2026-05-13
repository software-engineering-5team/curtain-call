package com.curtain_call.server_core.domain.seat.repository;

import com.curtain_call.server_core.domain.seat.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    /**
     * 특정 공연의 모든 좌석 조회
     */
    List<Seat> findAllByPerformanceId(Long performanceId);

    /**
     * 특정 공연의 모든 좌석 삭제 (배치 재설정용)
     */
    @Modifying
    @Query("DELETE FROM Seat s WHERE s.performance.id = :performanceId")
    void deleteByPerformanceId(@Param("performanceId") Long performanceId);
}

package com.curtain_call.server_core.domain.performance.repository;

import com.curtain_call.server_core.domain.performance.entity.Performance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    /**
     * 특정 대여(Rental)로 이미 등록된 공연이 있는지 확인
     */
    boolean existsByRentalId(Long rentalId);

    /**
     * 특정 사용자가 등록한 공연 목록 조회
     */
    List<Performance> findAllByRentalApplicantId(Long userId);

    /**
     * 공연 목록 조회 (페이징)
     */
    Page<Performance> findAll(Pageable pageable);
}

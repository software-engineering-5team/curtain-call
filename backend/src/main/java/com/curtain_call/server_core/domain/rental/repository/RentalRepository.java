package com.curtain_call.server_core.domain.rental.repository;

import com.curtain_call.server_core.domain.rental.entity.Rental;
import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    /**
     * 특정 날짜에 특정 시간 범위와 겹치는 확정된 대여가 있는지 확인
     * 중복 조건: (새 시작시간 < 기존 종료시간) AND (새 종료시간 > 기존 시작시간)
     */
    boolean existsByUseDateAndStatusAndStartTimeBeforeAndEndTimeAfter(
            LocalDate useDate, RentalStatus status, LocalTime endTime, LocalTime startTime);

    /**
     * 특정 기간 내의 모든 대여 내역 조회 (캘린더용)
     */
    List<Rental> findAllByUseDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * 특정 사용자의 대여 신청 내역 조회
     */
    List<Rental> findAllByApplicantId(Long applicantId);
}

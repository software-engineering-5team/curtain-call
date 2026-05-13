package com.curtain_call.server_core.domain.rental.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import com.curtain_call.server_core.domain.rental.dto.request.RentalCheckRequest;
import com.curtain_call.server_core.domain.rental.dto.request.RentalCreateRequest;
import com.curtain_call.server_core.domain.rental.dto.response.RentalCheckResponse;
import com.curtain_call.server_core.domain.rental.dto.response.RentalResponse;
import com.curtain_call.server_core.domain.rental.entity.Rental;
import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import com.curtain_call.server_core.domain.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    /**
     * 공연장 대여 신청
     */
    @Transactional
    public RentalResponse createRental(Long userId, RentalCreateRequest request) {
        // 1. 시간 중복 검증
        if (isTimeConflicting(request.getUseDate(), request.getStartTime(), request.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "해당 시간에 이미 확정된 대여 신청이 존재합니다.");
        }

        // 2. 신청자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        // 3. Rental 엔티티 생성
        Rental rental = Rental.builder()
                .applicant(user)
                .applicantName(request.getApplicantName())
                .studentId(request.getStudentId())
                .phone(request.getPhone())
                .clubName(request.getClubName())
                .activityName(request.getActivityName())
                .eventName(request.getEventName())
                .eventDescription(request.getEventDescription())
                .useDate(request.getUseDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .expectedAttendees(request.getExpectedAttendees())
                .status(RentalStatus.CONFIRMED)
                .build();

        return convertToResponse(rentalRepository.save(rental));
    }

    /**
     * 대여 가능 여부 확인
     */
    public RentalCheckResponse checkTimeConflict(RentalCheckRequest request) {
        boolean isConflicting = isTimeConflicting(request.getUseDate(), request.getStartTime(), request.getEndTime());
        return RentalCheckResponse.builder()
                .available(!isConflicting)
                .conflicts(Collections.emptyList()) // 상세 충돌 목록은 요구사항에 따라 추가 구현 가능
                .build();
    }

    /**
     * 기간별 대여 일정 조회 (캘린더용)
     */
    public List<RentalResponse> getRentals(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now().plusMonths(3);

        return rentalRepository.findAllByUseDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 대여 상세 조회
     */
    public RentalResponse getRentalDetail(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 내역을 찾을 수 없습니다."));
        return convertToResponse(rental);
    }

    /**
     * 내 대여 내역 조회
     */
    public List<RentalResponse> getMyRentals(Long userId) {
        return rentalRepository.findAllByApplicantId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 대여 취소
     */
    @Transactional
    public RentalResponse cancelRental(Long userId, Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 내역을 찾을 수 없습니다."));

        // 본인 소유 검증
        if (!rental.getApplicant().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 대여 신청만 취소할 수 있습니다.");
        }

        // 이미 취소된 경우 예외 처리 가능 (선택 사항)
        
        // 상태 변경 (Soft Cancel)
        rental.cancel();
        
        return convertToResponse(rental);
    }

    private boolean isTimeConflicting(LocalDate useDate, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        return rentalRepository.existsByUseDateAndStatusAndStartTimeBeforeAndEndTimeAfter(
                useDate, RentalStatus.CONFIRMED, endTime, startTime);
    }

    private RentalResponse convertToResponse(Rental rental) {
        return RentalResponse.builder()
                .rentalId(rental.getId())
                .eventName(rental.getEventName())
                .useDate(rental.getUseDate())
                .startTime(rental.getStartTime())
                .endTime(rental.getEndTime())
                .status(rental.getStatus())
                .build();
    }
}

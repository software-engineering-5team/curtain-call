package com.curtain_call.server_core.domain.seat.service;

import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.performance.repository.PerformanceRepository;
import com.curtain_call.server_core.domain.seat.dto.request.SeatCreateRequest;
import com.curtain_call.server_core.domain.seat.dto.request.SeatUpdateRequest;
import com.curtain_call.server_core.domain.seat.dto.response.SeatStatusResponse;
import com.curtain_call.server_core.domain.seat.dto.response.SeatTemplateResponse;
import com.curtain_call.server_core.domain.seat.entity.Seat;
import com.curtain_call.server_core.domain.seat.entity.SeatStatus;
import com.curtain_call.server_core.domain.seat.repository.SeatRepository;
import com.curtain_call.server_core.domain.seat.repository.SeatTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatService {

    private final SeatRepository seatRepository;
    private final SeatTemplateRepository seatTemplateRepository;
    private final PerformanceRepository performanceRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, String> redisTemplate;

    /**
     * 좌석 템플릿 목록 조회
     */
    public List<SeatTemplateResponse> getSeatTemplates() {
        return seatTemplateRepository.findAll().stream()
                .map(template -> SeatTemplateResponse.builder()
                        .templateId(template.getId())
                        .name(template.getName())
                        .rows(template.getRowCount())
                        .cols(template.getColCount())
                        .layout(template.getLayout())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 특정 공연의 좌석 배치 생성
     */
    @Transactional
    public void createSeats(Long userId, Long performanceId, SeatCreateRequest request) {
        Performance performance = getPerformanceAndValidateOwner(userId, performanceId);

        // 기존 좌석 삭제 후 재생성 (배치 설정은 예매 시작 전만 가능하도록 정책 설정 가능)
        if (performance.getBookingStartDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예매가 시작된 공연의 좌석 배치는 생성할 수 없습니다.");
        }

        seatRepository.deleteByPerformanceId(performanceId);

        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= request.getRows(); row++) {
            String rowNum = String.valueOf((char) ('A' + row - 1));
            for (int col = 1; col <= request.getCols(); col++) {
                String label = rowNum + col;
                SeatStatus status = (request.getDisabledSeats() != null && request.getDisabledSeats().contains(label))
                        ? SeatStatus.UNAVAILABLE : SeatStatus.AVAILABLE;

                seats.add(Seat.builder()
                        .performance(performance)
                        .rowNum(rowNum)
                        .colNum(col)
                        .label(label)
                        .status(status)
                        .build());
            }
        }
        seatRepository.saveAll(seats);
    }

    /**
     * 좌석 배치 수정 (비활성화 좌석 변경)
     */
    @Transactional
    public void updateSeats(Long userId, Long performanceId, SeatUpdateRequest request) {
        Performance performance = getPerformanceAndValidateOwner(userId, performanceId);

        // 예매 시작 전인지 확인
        if (performance.getBookingStartDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예매가 시작된 공연의 좌석 배치는 수정할 수 없습니다.");
        }

        List<Seat> seats = seatRepository.findAllByPerformanceId(performanceId);
        List<String> disabledSeats = request.getDisabledSeats() != null ? request.getDisabledSeats() : new ArrayList<>();

        for (Seat seat : seats) {
            // 현재 예매되었거나 점유된 좌석은 건드리지 않음 (예매 시작 전이라 사실상 AVAILABLE/UNAVAILABLE만 존재해야 함)
            if (seat.getStatus() == SeatStatus.RESERVED || seat.getStatus() == SeatStatus.SELECTING) {
                continue;
            }
            
            if (disabledSeats.contains(seat.getLabel())) {
                seat.updateStatus(SeatStatus.UNAVAILABLE);
            } else {
                seat.updateStatus(SeatStatus.AVAILABLE);
            }
        }
    }

    /**
     * 특정 공연의 실시간 좌석 상태 조회
     */
    public List<SeatStatusResponse> getSeatsStatus(Long performanceId) {
        List<Seat> seats = seatRepository.findAllByPerformanceId(performanceId);
        return seats.stream()
                .map(seat -> {
                    SeatStatus status = seat.getStatus();
                    if (status == SeatStatus.AVAILABLE) {
                        if (Boolean.TRUE.equals(redisTemplate.hasKey("hold:seat:" + seat.getId()))) {
                            status = SeatStatus.SELECTING;
                        }
                    }
                    return SeatStatusResponse.builder()
                        .seatId(seat.getId())
                        .rowNum(seat.getRowNum())
                        .colNum(seat.getColNum())
                        .label(seat.getLabel())
                        .status(status)
                        .build();
                })
                .collect(Collectors.toList());
    }

    private Performance getPerformanceAndValidateOwner(Long userId, Long performanceId) {
        Performance performance = performanceRepository.findById(performanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연 정보를 찾을 수 없습니다."));

        if (!performance.getRental().getApplicant().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 공연 정보에 대해서만 권한이 있습니다.");
        }
        return performance;
    }
}

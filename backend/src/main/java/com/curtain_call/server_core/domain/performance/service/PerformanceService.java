package com.curtain_call.server_core.domain.performance.service;

import com.curtain_call.server_core.domain.performance.dto.request.PerformanceCreateRequest;
import com.curtain_call.server_core.domain.performance.dto.request.PerformanceUpdateRequest;
import com.curtain_call.server_core.domain.performance.dto.response.PerformanceResponse;
import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.performance.repository.PerformanceRepository;
import com.curtain_call.server_core.domain.rental.entity.Rental;
import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import com.curtain_call.server_core.domain.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final RentalRepository rentalRepository;

    private static final String UPLOAD_DIR = "uploads/posters/";

    /**
     * 공연 정보 등록
     */
    @Transactional
    public PerformanceResponse createPerformance(Long userId, PerformanceCreateRequest request) {
        // 1. Rental 검증
        Rental rental = rentalRepository.findById(request.getRentalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 내역을 찾을 수 없습니다."));

        // 본인 소유 검증
        if (!rental.getApplicant().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 대여 내역에 대해서만 공연을 등록할 수 있습니다.");
        }

        // 확정 상태 검증
        if (rental.getStatus() != RentalStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "확정된 대여 내역만 공연 등록이 가능합니다.");
        }

        // 중복 등록 검증 (Rental당 1개의 공연)
        if (performanceRepository.existsByRentalId(request.getRentalId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 해당 대여 내역으로 등록된 공연이 존재합니다.");
        }

        // 2. Performance 생성
        Performance performance = Performance.builder()
                .rental(rental)
                .title(request.getTitle())
                .description(request.getDescription())
                .posterImageUrl(request.getPosterImageUrl())
                .bookingStartDate(request.getBookingStartAt())
                .bookingEndDate(request.getBookingEndAt())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .maxSeatsPerPerson(request.getMaxSeatsPerPerson())
                .build();

        return convertToResponse(performanceRepository.save(performance));
    }

    /**
     * 공연 정보 수정
     */
    @Transactional
    public PerformanceResponse updatePerformance(Long userId, Long performanceId, PerformanceUpdateRequest request) {
        Performance performance = performanceRepository.findById(performanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연 정보를 찾을 수 없습니다."));

        // 본인 소유 검증 (Rental 신청자 확인)
        if (!performance.getRental().getApplicant().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 공연 정보만 수정할 수 있습니다.");
        }

        // 업데이트 로직
        performance.update(
                request.getTitle(),
                request.getDescription(),
                request.getPosterImageUrl(),
                request.getBookingStartAt(),
                request.getBookingEndAt()
        );
        
        return convertToResponse(performance);
    }

    /**
     * 포스터 이미지 업로드
     */
    public String uploadPoster(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일이 비어있습니다.");
        }

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return "/api/images/posters/" + fileName; // 정적 리소스 접근 경로
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생했습니다.");
        }
    }

    /**
     * 공연 목록 조회 (페이징)
     */
    public Page<PerformanceResponse> getPerformances(Pageable pageable) {
        return performanceRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * 공연 상세 조회
     */
    public PerformanceResponse getPerformanceDetail(Long performanceId) {
        Performance performance = performanceRepository.findById(performanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연 정보를 찾을 수 없습니다."));
        return convertToResponse(performance);
    }

    /**
     * 내 공연 목록 조회
     */
    public List<PerformanceResponse> getMyPerformances(Long userId) {
        return performanceRepository.findAllByRentalApplicantId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private PerformanceResponse convertToResponse(Performance performance) {
        return PerformanceResponse.builder()
                .performanceId(performance.getId())
                .title(performance.getTitle())
                .description(performance.getDescription())
                .posterImageUrl(performance.getPosterImageUrl())
                .bookingStartAt(performance.getBookingStartDate())
                .bookingEndAt(performance.getBookingEndDate())
                .totalSeats(performance.getTotalSeats())
                .availableSeats(performance.getAvailableSeats())
                .build();
    }
}

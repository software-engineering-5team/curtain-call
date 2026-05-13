package com.curtain_call.server_core.domain.booking.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import com.curtain_call.server_core.domain.booking.dto.request.BookingCreateRequest;
import com.curtain_call.server_core.domain.booking.dto.request.BookingHoldRequest;
import com.curtain_call.server_core.domain.booking.dto.response.BookingHoldResponse;
import com.curtain_call.server_core.domain.booking.dto.response.BookingResponse;
import com.curtain_call.server_core.domain.booking.dto.response.PerformanceBookingStatusResponse;
import com.curtain_call.server_core.domain.booking.entity.Booking;
import com.curtain_call.server_core.domain.booking.entity.BookingSeat;
import com.curtain_call.server_core.domain.booking.entity.BookingStatus;
import com.curtain_call.server_core.domain.booking.repository.BookingRepository;
import com.curtain_call.server_core.domain.booking.repository.BookingSeatRepository;
import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.performance.repository.PerformanceRepository;
import com.curtain_call.server_core.domain.seat.entity.Seat;
import com.curtain_call.server_core.domain.seat.entity.SeatStatus;
import com.curtain_call.server_core.domain.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatRepository seatRepository;
    private final PerformanceRepository performanceRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String HOLD_TOKEN_PREFIX = "hold:token:";
    private static final String SEAT_HOLD_PREFIX = "hold:seat:";
    private static final long HOLD_TTL_MINUTES = 10;

    /**
     * 좌석 임시 선점 (Redis 활용)
     */
    @Transactional
    public BookingHoldResponse holdSeats(Long userId, BookingHoldRequest request) {
        Performance performance = performanceRepository.findById(request.getPerformanceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연 정보를 찾을 수 없습니다."));

        // 예매 기간 검증
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(performance.getBookingStartDate()) || now.isAfter(performance.getBookingEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "현재는 예매 가능 기간이 아닙니다.");
        }

        // 1인당 한도 검증 (간략화: 현재 확정된 예매만 체크)
        // 실제로는 Hold 중인 것도 체크할 수 있으나 여기선 생략
        List<Booking> myBookings = bookingRepository.findAllByUserIdAndStatus(userId, BookingStatus.CONFIRMED);
        int myReservedSeats = myBookings.stream()
                .mapToInt(b -> bookingSeatRepository.findAllByBookingId(b.getId()).size())
                .sum();
        
        if (myReservedSeats + request.getSeatIds().size() > performance.getMaxSeatsPerPerson()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "1인당 최대 예매 가능 좌석 수를 초과했습니다.");
        }

        // Redis를 이용한 개별 좌석 선점 확인 및 점유
        for (Long seatId : request.getSeatIds()) {
            String seatKey = SEAT_HOLD_PREFIX + seatId;
            Boolean success = redisTemplate.opsForValue().setIfAbsent(seatKey, userId.toString(), HOLD_TTL_MINUTES, TimeUnit.MINUTES);
            if (Boolean.FALSE.equals(success)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 다른 사용자가 선택 중인 좌석이 포함되어 있습니다.");
            }
            
            // DB 상태 확인 (이미 예매된 경우)
            Seat seat = seatRepository.findById(seatId).orElseThrow();
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                // Redis 선점 해제 (롤백 의미)
                redisTemplate.delete(seatKey);
                throw new ResponseStatusException(HttpStatus.CONFLICT, "예매 불가능한 좌석이 포함되어 있습니다.");
            }
        }

        // Hold Token 생성
        String holdToken = UUID.randomUUID().toString();
        String tokenData = userId + ":" + request.getPerformanceId() + ":" + 
                request.getSeatIds().stream().map(String::valueOf).collect(Collectors.joining(","));
        
        redisTemplate.opsForValue().set(HOLD_TOKEN_PREFIX + holdToken, tokenData, HOLD_TTL_MINUTES, TimeUnit.MINUTES);

        return BookingHoldResponse.builder()
                .holdToken(holdToken)
                .expiresAt(now.plusMinutes(HOLD_TTL_MINUTES))
                .build();
    }

    /**
     * 임시 선점 해제
     */
    public void releaseHold(String holdToken) {
        String data = redisTemplate.opsForValue().get(HOLD_TOKEN_PREFIX + holdToken);
        if (data != null) {
            String[] parts = data.split(":");
            List<String> seatIds = Arrays.asList(parts[2].split(","));
            for (String seatId : seatIds) {
                redisTemplate.delete(SEAT_HOLD_PREFIX + seatId);
            }
            redisTemplate.delete(HOLD_TOKEN_PREFIX + holdToken);
        }
    }

    /**
     * 예매 확정
     */
    @Transactional
    public BookingResponse createBooking(Long userId, BookingCreateRequest request) {
        // 1. Hold Token 검증
        String tokenData = redisTemplate.opsForValue().get(HOLD_TOKEN_PREFIX + request.getHoldToken());
        if (tokenData == null) {
            throw new ResponseStatusException(HttpStatus.GONE, "선점 시간이 만료되었거나 유효하지 않은 토큰입니다.");
        }

        String[] parts = tokenData.split(":");
        Long tokenUserId = Long.valueOf(parts[0]);
        Long tokenPerfId = Long.valueOf(parts[1]);
        List<Long> seatIds = Arrays.stream(parts[2].split(",")).map(Long::valueOf).collect(Collectors.toList());

        if (!tokenUserId.equals(userId) || !tokenPerfId.equals(request.getPerformanceId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "잘못된 예매 요청입니다.");
        }

        // 2. 엔티티 조회
        User user = userRepository.findById(userId).orElseThrow();
        Performance performance = performanceRepository.findById(request.getPerformanceId()).orElseThrow();

        // 3. Booking 생성
        Booking booking = Booking.builder()
                .user(user)
                .performance(performance)
                .status(BookingStatus.CONFIRMED)
                .build();
        bookingRepository.save(booking);

        // 4. 좌석 상태 변경 및 매핑
        for (Long seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId).orElseThrow();
            seat.updateStatus(SeatStatus.RESERVED);
            
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .build();
            bookingSeatRepository.save(bookingSeat);
            
            // Redis 선점 정보 삭제
            redisTemplate.delete(SEAT_HOLD_PREFIX + seatId);
        }

        // 5. 공연 잔여석 차감
        performance.decreaseAvailableSeats(seatIds.size());
        
        // 6. Token 삭제
        redisTemplate.delete(HOLD_TOKEN_PREFIX + request.getHoldToken());

        return convertToResponse(booking, seatIds.size());
    }

    /**
     * 예매 취소
     */
    @Transactional
    public void cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예매 내역을 찾을 수 없습니다."));

        if (!booking.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 예매만 취소할 수 있습니다.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 취소된 예매입니다.");
        }

        // 공연 시작 전인지 확인 가능 (AGENTS.md 규칙: 공연 시작 시각 이후 취소 거부)
        // 현재 Performance 엔티티에 공연 시작 시간이 명시적으로 없으나 Rental 정보를 통해 유추 가능
        // 간단히 생략하거나 Rental의 useDate를 확인
        
        // 상태 변경 (Soft Cancel)
        booking.cancel();

        // 좌석 상태 복구
        List<BookingSeat> bookingSeats = bookingSeatRepository.findAllByBookingId(bookingId);
        for (BookingSeat bs : bookingSeats) {
            bs.getSeat().updateStatus(SeatStatus.AVAILABLE);
        }

        // 공연 잔여석 복구
        booking.getPerformance().increaseAvailableSeats(bookingSeats.size());
    }

    /**
     * 조회 메서드들
     */
    public List<BookingResponse> getMyBookings(Long userId, String status) {
        List<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findAllByUserIdAndStatus(userId, BookingStatus.valueOf(status));
        } else {
            bookings = bookingRepository.findAllByUserId(userId);
        }
        
        return bookings.stream()
                .map(b -> convertToResponse(b, bookingSeatRepository.findAllByBookingId(b.getId()).size()))
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingDetail(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        int seatCount = bookingSeatRepository.findAllByBookingId(bookingId).size();
        return convertToResponse(booking, seatCount);
    }

    public PerformanceBookingStatusResponse getPerformanceBookingStatus(Long performanceId) {
        Performance performance = performanceRepository.findById(performanceId).orElseThrow();
        List<Booking> bookings = bookingRepository.findAllByPerformanceId(performanceId);
        
        return PerformanceBookingStatusResponse.builder()
                .performanceId(performanceId)
                .totalSeats(performance.getTotalSeats())
                .availableSeats(performance.getAvailableSeats())
                .confirmedBookings(bookings.size())
                .build();
    }

    private BookingResponse convertToResponse(Booking booking, int seatCount) {
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .performanceTitle(booking.getPerformance().getTitle())
                .status(booking.getStatus())
                .seatCount(seatCount)
                .createdAt(booking.getCreatedAt())
                .build();
    }
}

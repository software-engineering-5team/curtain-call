package com.curtain_call.server_core.domain.seat.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.performance.repository.PerformanceRepository;
import com.curtain_call.server_core.domain.rental.entity.Rental;
import com.curtain_call.server_core.domain.seat.dto.request.SeatCreateRequest;
import com.curtain_call.server_core.domain.seat.dto.request.SeatUpdateRequest;
import com.curtain_call.server_core.domain.seat.entity.Seat;
import com.curtain_call.server_core.domain.seat.entity.SeatStatus;
import com.curtain_call.server_core.domain.seat.repository.SeatRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SeatServiceTest {

    @InjectMocks
    private SeatService seatService;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private PerformanceRepository performanceRepository;

    @Mock
    private org.springframework.data.redis.core.RedisTemplate<String, String> redisTemplate;

    private Performance createMockPerformance(Long ownerId, LocalDateTime bookingStartDate) {
        User owner = org.mockito.Mockito.mock(User.class);
        org.mockito.BDDMockito.given(owner.getId()).willReturn(ownerId);

        Rental rental = org.mockito.Mockito.mock(Rental.class);
        org.mockito.BDDMockito.given(rental.getApplicant()).willReturn(owner);

        Performance performance = org.mockito.Mockito.mock(Performance.class);
        org.mockito.BDDMockito.given(performance.getRental()).willReturn(rental);
        org.mockito.Mockito.lenient().when(performance.getBookingStartDate()).thenReturn(bookingStartDate);
        
        return performance;
    }

    @Test
    @DisplayName("좌석 생성 성공 - 권한이 있고 예매 시작 전인 경우")
    void createSeats_Success() {
        // given
        Long userId = 1L;
        Long performanceId = 100L;
        Performance performance = createMockPerformance(userId, LocalDateTime.now().plusDays(1));
        given(performanceRepository.findById(performanceId)).willReturn(Optional.of(performance));

        SeatCreateRequest request = new SeatCreateRequest();
        ReflectionTestUtils.setField(request, "rows", 2);
        ReflectionTestUtils.setField(request, "cols", 2);
        ReflectionTestUtils.setField(request, "disabledSeats", List.of("A1"));

        // when
        seatService.createSeats(userId, performanceId, request);

        // then
        verify(seatRepository).deleteByPerformanceId(performanceId);
        verify(seatRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("좌석 생성 실패 - 본인의 공연이 아닐 경우 예외 발생")
    void createSeats_Fail_Forbidden() {
        // given
        Long userId = 1L;
        Long otherUserId = 2L;
        Long performanceId = 100L;
        Performance performance = createMockPerformance(otherUserId, LocalDateTime.now().plusDays(1));
        given(performanceRepository.findById(performanceId)).willReturn(Optional.of(performance));

        SeatCreateRequest request = new SeatCreateRequest();

        // when & then
        assertThatThrownBy(() -> seatService.createSeats(userId, performanceId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신의 공연 정보에 대해서만 권한이 있습니다");
    }

    @Test
    @DisplayName("좌석 수정 성공 - 예매 시작 전 비활성화 좌석 변경")
    void updateSeats_Success() {
        // given
        Long userId = 1L;
        Long performanceId = 100L;
        Performance performance = createMockPerformance(userId, LocalDateTime.now().plusDays(1));
        given(performanceRepository.findById(performanceId)).willReturn(Optional.of(performance));

        Seat seatA1 = Seat.builder().label("A1").status(SeatStatus.AVAILABLE).build();
        Seat seatA2 = Seat.builder().label("A2").status(SeatStatus.UNAVAILABLE).build();
        given(seatRepository.findAllByPerformanceId(performanceId)).willReturn(List.of(seatA1, seatA2));

        SeatUpdateRequest request = new SeatUpdateRequest();
        ReflectionTestUtils.setField(request, "disabledSeats", List.of("A1"));

        // when
        seatService.updateSeats(userId, performanceId, request);

        // then
        assertThat(seatA1.getStatus()).isEqualTo(SeatStatus.UNAVAILABLE);
        assertThat(seatA2.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
    }
}

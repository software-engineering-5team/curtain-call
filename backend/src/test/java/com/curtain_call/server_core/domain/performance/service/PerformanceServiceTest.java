package com.curtain_call.server_core.domain.performance.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.performance.dto.request.PerformanceCreateRequest;
import com.curtain_call.server_core.domain.performance.dto.request.PerformanceUpdateRequest;
import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.performance.repository.PerformanceRepository;
import com.curtain_call.server_core.domain.rental.entity.Rental;
import com.curtain_call.server_core.domain.rental.entity.RentalStatus;
import com.curtain_call.server_core.domain.rental.repository.RentalRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PerformanceServiceTest {

    @InjectMocks
    private PerformanceService performanceService;

    @Mock
    private PerformanceRepository performanceRepository;

    @Mock
    private RentalRepository rentalRepository;

    @Test
    @DisplayName("공연 등록 성공")
    void createPerformance_Success() {
        // given
        Long userId = 1L;
        Long rentalId = 100L;

        User owner = mock(User.class);
        given(owner.getId()).willReturn(userId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(owner);
        given(rental.getStatus()).willReturn(RentalStatus.CONFIRMED);

        given(rentalRepository.findById(rentalId)).willReturn(Optional.of(rental));
        given(performanceRepository.existsByRentalId(rentalId)).willReturn(false);

        PerformanceCreateRequest request = new PerformanceCreateRequest();
        ReflectionTestUtils.setField(request, "rentalId", rentalId);
        ReflectionTestUtils.setField(request, "title", "Test Title");
        ReflectionTestUtils.setField(request, "description", "Test Desc");

        Performance savedPerformance = mock(Performance.class);
        given(performanceRepository.save(any(Performance.class))).willReturn(savedPerformance);

        // when
        performanceService.createPerformance(userId, request);

        // then
        verify(performanceRepository).save(any(Performance.class));
    }

    @Test
    @DisplayName("공연 등록 실패 - 확정되지 않은 대여")
    void createPerformance_Fail_NotConfirmed() {
        // given
        Long userId = 1L;
        Long rentalId = 100L;

        User owner = mock(User.class);
        given(owner.getId()).willReturn(userId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(owner);
        given(rental.getStatus()).willReturn(RentalStatus.CANCELLED);

        given(rentalRepository.findById(rentalId)).willReturn(Optional.of(rental));

        PerformanceCreateRequest request = new PerformanceCreateRequest();
        ReflectionTestUtils.setField(request, "rentalId", rentalId);

        // when & then
        assertThatThrownBy(() -> performanceService.createPerformance(userId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("확정된 대여 내역만");
    }

    @Test
    @DisplayName("공연 등록 실패 - 본인의 대여가 아님")
    void createPerformance_Fail_NotOwner() {
        // given
        Long userId = 1L;
        Long otherUserId = 2L;
        Long rentalId = 100L;

        User otherUser = mock(User.class);
        given(otherUser.getId()).willReturn(otherUserId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(otherUser);

        given(rentalRepository.findById(rentalId)).willReturn(Optional.of(rental));

        PerformanceCreateRequest request = new PerformanceCreateRequest();
        ReflectionTestUtils.setField(request, "rentalId", rentalId);

        // when & then
        assertThatThrownBy(() -> performanceService.createPerformance(userId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신의 대여 내역에 대해서만");
    }

    @Test
    @DisplayName("공연 정보 수정 성공")
    void updatePerformance_Success() {
        // given
        Long userId = 1L;
        Long performanceId = 200L;

        User owner = mock(User.class);
        given(owner.getId()).willReturn(userId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(owner);

        Performance performance = mock(Performance.class);
        given(performance.getRental()).willReturn(rental);

        given(performanceRepository.findById(performanceId)).willReturn(Optional.of(performance));

        PerformanceUpdateRequest request = new PerformanceUpdateRequest();
        ReflectionTestUtils.setField(request, "title", "Updated Title");

        // when
        performanceService.updatePerformance(userId, performanceId, request);

        // then
        verify(performance).update(
                eq("Updated Title"),
                any(), any(), any(), any()
        );
    }
}

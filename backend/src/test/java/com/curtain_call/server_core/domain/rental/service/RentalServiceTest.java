package com.curtain_call.server_core.domain.rental.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.auth.repository.UserRepository;
import com.curtain_call.server_core.domain.rental.dto.request.RentalCreateRequest;
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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    @InjectMocks
    private RentalService rentalService;

    @Mock
    private RentalRepository rentalRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("대여 신청 성공")
    void createRental_Success() {
        // given
        Long userId = 1L;
        LocalDate useDate = LocalDate.of(2026, 6, 1);
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(16, 0);

        RentalCreateRequest request = new RentalCreateRequest();
        ReflectionTestUtils.setField(request, "useDate", useDate);
        ReflectionTestUtils.setField(request, "startTime", startTime);
        ReflectionTestUtils.setField(request, "endTime", endTime);

        given(rentalRepository.existsByUseDateAndStatusAndStartTimeBeforeAndEndTimeAfter(
                eq(useDate), eq(RentalStatus.CONFIRMED), eq(endTime), eq(startTime)))
                .willReturn(false);

        User user = mock(User.class);
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        Rental savedRental = mock(Rental.class);
        given(rentalRepository.save(any(Rental.class))).willReturn(savedRental);

        // when
        rentalService.createRental(userId, request);

        // then
        verify(rentalRepository).save(any(Rental.class));
    }

    @Test
    @DisplayName("대여 신청 실패 - 시간 중복")
    void createRental_Fail_TimeConflict() {
        // given
        Long userId = 1L;
        LocalDate useDate = LocalDate.of(2026, 6, 1);
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(16, 0);

        RentalCreateRequest request = new RentalCreateRequest();
        ReflectionTestUtils.setField(request, "useDate", useDate);
        ReflectionTestUtils.setField(request, "startTime", startTime);
        ReflectionTestUtils.setField(request, "endTime", endTime);

        given(rentalRepository.existsByUseDateAndStatusAndStartTimeBeforeAndEndTimeAfter(
                eq(useDate), eq(RentalStatus.CONFIRMED), eq(endTime), eq(startTime)))
                .willReturn(true);

        // when & then
        assertThatThrownBy(() -> rentalService.createRental(userId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("시간에 이미 확정된 대여");
    }

    @Test
    @DisplayName("대여 취소 성공")
    void cancelRental_Success() {
        // given
        Long userId = 1L;
        Long rentalId = 100L;

        User applicant = mock(User.class);
        given(applicant.getId()).willReturn(userId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(applicant);

        given(rentalRepository.findById(rentalId)).willReturn(Optional.of(rental));

        // when
        rentalService.cancelRental(userId, rentalId);

        // then
        verify(rental).cancel();
    }

    @Test
    @DisplayName("대여 취소 실패 - 본인의 신청이 아님")
    void cancelRental_Fail_NotOwner() {
        // given
        Long userId = 1L;
        Long otherUserId = 2L;
        Long rentalId = 100L;

        User applicant = mock(User.class);
        given(applicant.getId()).willReturn(otherUserId);

        Rental rental = mock(Rental.class);
        given(rental.getApplicant()).willReturn(applicant);

        given(rentalRepository.findById(rentalId)).willReturn(Optional.of(rental));

        // when & then
        assertThatThrownBy(() -> rentalService.cancelRental(userId, rentalId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신의 대여 신청만");
    }
}

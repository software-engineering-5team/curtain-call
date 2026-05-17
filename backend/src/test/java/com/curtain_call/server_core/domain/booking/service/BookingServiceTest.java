package com.curtain_call.server_core.domain.booking.service;

import com.curtain_call.server_core.domain.auth.entity.User;
import com.curtain_call.server_core.domain.booking.dto.response.BookingResponse;
import com.curtain_call.server_core.domain.booking.entity.Booking;
import com.curtain_call.server_core.domain.booking.entity.BookingSeat;
import com.curtain_call.server_core.domain.booking.entity.BookingStatus;
import com.curtain_call.server_core.domain.booking.repository.BookingRepository;
import com.curtain_call.server_core.domain.booking.repository.BookingSeatRepository;
import com.curtain_call.server_core.domain.performance.entity.Performance;
import com.curtain_call.server_core.domain.seat.entity.Seat;
import com.curtain_call.server_core.domain.seat.entity.SeatStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @InjectMocks
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingSeatRepository bookingSeatRepository;

    @Test
    @DisplayName("예매 취소 성공")
    void cancelBooking_Success() {
        // given
        Long userId = 1L;
        Long bookingId = 100L;

        User user = mock(User.class);
        given(user.getId()).willReturn(userId);

        Performance performance = mock(Performance.class);

        Booking booking = mock(Booking.class);
        given(booking.getUser()).willReturn(user);
        given(booking.getStatus()).willReturn(BookingStatus.CONFIRMED);
        given(booking.getPerformance()).willReturn(performance);

        given(bookingRepository.findById(bookingId)).willReturn(Optional.of(booking));

        Seat seat = mock(Seat.class);
        BookingSeat bookingSeat = mock(BookingSeat.class);
        given(bookingSeat.getSeat()).willReturn(seat);

        List<BookingSeat> bookingSeats = List.of(bookingSeat);
        given(bookingSeatRepository.findAllByBookingId(bookingId)).willReturn(bookingSeats);

        // when
        bookingService.cancelBooking(userId, bookingId);

        // then
        verify(booking).cancel();
        verify(seat).updateStatus(SeatStatus.AVAILABLE);
        verify(performance).increaseAvailableSeats(1);
    }

    @Test
    @DisplayName("예매 취소 실패 - 타인의 예매")
    void cancelBooking_Fail_NotOwner() {
        // given
        Long userId = 1L;
        Long otherUserId = 2L;
        Long bookingId = 100L;

        User otherUser = mock(User.class);
        given(otherUser.getId()).willReturn(otherUserId);

        Booking booking = mock(Booking.class);
        given(booking.getUser()).willReturn(otherUser);

        given(bookingRepository.findById(bookingId)).willReturn(Optional.of(booking));

        // when & then
        assertThatThrownBy(() -> bookingService.cancelBooking(userId, bookingId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신의 예매만 취소할 수 있습니다");
    }

    @Test
    @DisplayName("예매 취소 실패 - 이미 취소된 예매")
    void cancelBooking_Fail_AlreadyCancelled() {
        // given
        Long userId = 1L;
        Long bookingId = 100L;

        User user = mock(User.class);
        given(user.getId()).willReturn(userId);

        Booking booking = mock(Booking.class);
        given(booking.getUser()).willReturn(user);
        given(booking.getStatus()).willReturn(BookingStatus.CANCELLED);

        given(bookingRepository.findById(bookingId)).willReturn(Optional.of(booking));

        // when & then
        assertThatThrownBy(() -> bookingService.cancelBooking(userId, bookingId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("이미 취소된 예매입니다");
    }

    @Test
    @DisplayName("내 예매 목록 조회 성공 (status 조건 포함)")
    void getMyBookings_Success() {
        // given
        Long userId = 1L;

        Performance performance = mock(Performance.class);
        given(performance.getId()).willReturn(200L);
        given(performance.getTitle()).willReturn("Test Perf");

        Booking booking = mock(Booking.class);
        given(booking.getId()).willReturn(100L);
        given(booking.getPerformance()).willReturn(performance);
        given(booking.getStatus()).willReturn(BookingStatus.CONFIRMED);

        given(bookingRepository.findAllByUserIdAndStatus(userId, BookingStatus.CONFIRMED)).willReturn(List.of(booking));
        given(bookingSeatRepository.findAllByBookingId(100L)).willReturn(List.of(mock(BookingSeat.class), mock(BookingSeat.class)));

        // when
        List<BookingResponse> responses = bookingService.getMyBookings(userId, "CONFIRMED");

        // then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getBookingId()).isEqualTo(100L);
        assertThat(responses.get(0).getSeatCount()).isEqualTo(2);
        assertThat(responses.get(0).getPerformanceTitle()).isEqualTo("Test Perf");
    }

    @Test
    @DisplayName("예매 상세 조회 성공")
    void getBookingDetail_Success() {
        // given
        Long bookingId = 100L;

        Performance performance = mock(Performance.class);
        given(performance.getId()).willReturn(200L);
        given(performance.getTitle()).willReturn("Test Perf");

        Booking booking = mock(Booking.class);
        given(booking.getId()).willReturn(bookingId);
        given(booking.getPerformance()).willReturn(performance);
        given(booking.getStatus()).willReturn(BookingStatus.CONFIRMED);

        given(bookingRepository.findById(bookingId)).willReturn(Optional.of(booking));
        given(bookingSeatRepository.findAllByBookingId(bookingId)).willReturn(List.of(mock(BookingSeat.class)));

        // when
        BookingResponse response = bookingService.getBookingDetail(bookingId);

        // then
        assertThat(response.getBookingId()).isEqualTo(bookingId);
        assertThat(response.getSeatCount()).isEqualTo(1);
    }
}

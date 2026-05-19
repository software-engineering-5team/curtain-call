'use client';

import { useState, useMemo, use, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Spinner } from '@/components/ui/spinner';
import { performancesApi, seatsApi, bookingsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';
import type { PerformanceResponse, BookingResponse, SeatStatusResponse } from '@/lib/api-types';
import { Seat as SeatType } from '@/lib/types';
import {
  PerformanceInfoCard,
  SeatSelectionPanel,
} from '@/components/features/performance';
import { BookingSuccessCard } from '@/components/features/booking';

type BookingStatus = 'idle' | 'holding' | 'booking' | 'success' | 'error';

const MAX_SEATS_PER_PERSON = 4;

function mapSeat(s: SeatStatusResponse): SeatType {
  return {
    id: String(s.seatId),
    performanceId: '',
    row: s.rowNum,
    number: s.colNum,
    status: s.status.toLowerCase() as SeatType['status'],
  };
}

export default function PerformanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const performanceId = Number(id);
  const { user } = useAuth();

  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [apiSeats, setApiSeats] = useState<SeatStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      performancesApi.get(performanceId),
      seatsApi.list(performanceId),
    ])
      .then(([perf, seats]) => {
        setPerformance(perf);
        setApiSeats(seats);
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [performanceId]);

  const seats = useMemo(() => apiSeats.map(mapSeat), [apiSeats]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFoundFlag || !performance) return notFound();

  const now = new Date();
  const isBookingOpen =
    now >= new Date(performance.bookingStartAt) && now <= new Date(performance.bookingEndAt);
  const isSoldOut = performance.availableSeats === 0;

  const handleSeatClick = (seat: SeatType) => {
    if (seat.status !== 'available' && !selectedSeats.find(s => s.id === seat.id)) return;
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= MAX_SEATS_PER_PERSON) return prev;
      return [...prev, seat];
    });
  };

  const handleBooking = async () => {
    if (!user) {
      showAuthRequiredToast();
      return;
    }
    if (selectedSeats.length === 0) return;

    setBookingStatus('holding');
    setErrorMsg('');

    let holdToken = '';
    try {
      const seatIds = selectedSeats.map(s => Number(s.id));
      const holdRes = await bookingsApi.hold({ performanceId, seatIds });
      holdToken = holdRes.holdToken;
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '좌석 선점에 실패했습니다. 새로고침 후 다시 시도해 주세요.');
      return;
    }

    setBookingStatus('booking');
    try {
      const seatIds = selectedSeats.map(s => Number(s.id));
      const booking = await bookingsApi.create({ holdToken, performanceId, seatIds });
      setBookingResult(booking);
      setBookingStatus('success');
    } catch (err) {
      await bookingsApi.releaseHold(holdToken).catch(() => {});
      setBookingStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '예매에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  if (bookingStatus === 'success' && bookingResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <BookingSuccessCard
            performance={performance}
            booking={bookingResult}
            selectedSeats={selectedSeats}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/performances"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            공연 목록으로 돌아가기
          </Link>

          {bookingStatus === 'error' && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {errorMsg}
            </div>
          )}

          {(bookingStatus === 'holding' || bookingStatus === 'booking') && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground flex items-center gap-2">
              <Spinner />
              {bookingStatus === 'holding' ? '좌석을 선점하는 중...' : '예매를 처리하는 중...'}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PerformanceInfoCard performance={performance} isSoldOut={isSoldOut} />
            </div>

            <div className="lg:col-span-2">
              <SeatSelectionPanel
                performance={performance}
                seats={seats}
                selectedSeats={selectedSeats}
                maxSeatsPerPerson={MAX_SEATS_PER_PERSON}
                onSeatClick={handleSeatClick}
                onBook={handleBooking}
                isBookingOpen={isBookingOpen}
                isSoldOut={isSoldOut}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

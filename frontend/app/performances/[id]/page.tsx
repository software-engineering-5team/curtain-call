'use client';

import { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { performances, generateSeats } from '@/lib/mock-data';
import { Seat as SeatType } from '@/lib/types';
import {
  PerformanceInfoCard,
  SeatSelectionPanel,
} from '@/components/features/performance';
import { BookingSuccessCard } from '@/components/features/booking';

type BookingStatus = 'idle' | 'success';

export default function PerformanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const performance = performances.find(p => p.id === id);

  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');

  const seats = useMemo(() => {
    if (!performance) return [];
    return generateSeats(performance.id, 8, 15);
  }, [performance]);

  if (!performance) notFound();

  const isBookingOpen =
    new Date() >= performance.bookingStartDate && new Date() <= performance.bookingEndDate;
  const isSoldOut = performance.availableSeats === 0;

  const handleSeatClick = (seat: SeatType) => {
    if (seat.status !== 'available' && !selectedSeats.find(s => s.id === seat.id)) return;
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= performance.maxSeatsPerPerson) return prev;
      return [...prev, seat];
    });
  };

  const handleBooking = () => setBookingStatus('success');

  if (bookingStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userName="홍길동" />
        <main className="flex-1 flex items-center justify-center p-4">
          <BookingSuccessCard performance={performance} selectedSeats={selectedSeats} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName="홍길동" />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/performances"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            공연 목록으로 돌아가기
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PerformanceInfoCard performance={performance} isSoldOut={isSoldOut} />
            </div>

            <div className="lg:col-span-2">
              <SeatSelectionPanel
                performance={performance}
                seats={seats}
                selectedSeats={selectedSeats}
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

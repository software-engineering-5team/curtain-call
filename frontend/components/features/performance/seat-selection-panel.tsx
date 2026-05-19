'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import type { PerformanceResponse } from '@/lib/api-types';
import { Seat as SeatType } from '@/lib/types';
import { SeatButton, SeatLegend, SeatGrid } from '@/components/features/seat';
import { SelectedSeatsSummary } from '@/components/features/booking';

interface SeatSelectionPanelProps {
  performance: PerformanceResponse;
  seats: SeatType[];
  selectedSeats: SeatType[];
  maxSeatsPerPerson: number;
  onSeatClick: (seat: SeatType) => void;
  onBook: () => void;
  isBookingOpen: boolean;
  isSoldOut: boolean;
}

export function SeatSelectionPanel({
  performance,
  seats,
  selectedSeats,
  maxSeatsPerPerson,
  onSeatClick,
  onBook,
  isBookingOpen,
  isSoldOut,
}: SeatSelectionPanelProps) {
  const formatKorDate = (iso: string) =>
    new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
      new Date(iso)
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>좌석 선택</CardTitle>
      </CardHeader>
      <CardContent>
        {!isBookingOpen && !isSoldOut && (
          <Alert className="mb-6">
            <Info className="w-4 h-4" />
            <AlertDescription>
              예매 기간이 아닙니다. 예매 기간: {formatKorDate(performance.bookingStartAt)} ~ {formatKorDate(performance.bookingEndAt)}
            </AlertDescription>
          </Alert>
        )}

        <SeatGrid
          seats={seats}
          renderSeat={(seat) => (
            <SeatButton
              row={seat.row}
              number={seat.number}
              status={seat.status}
              isSelected={selectedSeats.some(s => s.id === seat.id)}
              onClick={() => onSeatClick(seat)}
              disabled={!isBookingOpen || isSoldOut}
              size="sm"
            />
          )}
        />

        <SeatLegend className="justify-center mt-6" />

        <Separator className="my-6" />

        <SelectedSeatsSummary
          selectedSeats={selectedSeats}
          maxSeatsPerPerson={maxSeatsPerPerson}
          isBookingOpen={isBookingOpen}
          isSoldOut={isSoldOut}
          onBook={onBook}
        />
      </CardContent>
    </Card>
  );
}

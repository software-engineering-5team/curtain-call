'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import { Performance, Seat as SeatType } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';
import { SeatButton, SeatLegend, SeatGrid } from '@/components/features/seat';
import { SelectedSeatsSummary } from '@/components/features/booking';

interface SeatSelectionPanelProps {
  performance: Performance;
  seats: SeatType[];
  selectedSeats: SeatType[];
  onSeatClick: (seat: SeatType) => void;
  onBook: () => void;
  isBookingOpen: boolean;
  isSoldOut: boolean;
}

/** 공연 상세 페이지의 우측 좌석 선택 패널. */
export function SeatSelectionPanel({
  performance,
  seats,
  selectedSeats,
  onSeatClick,
  onBook,
  isBookingOpen,
  isSoldOut,
}: SeatSelectionPanelProps) {
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
              예매 기간이 아닙니다. 예매 기간: {formatDate(performance.bookingStartDate)} ~ {formatDate(performance.bookingEndDate)}
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
          maxSeatsPerPerson={performance.maxSeatsPerPerson}
          isBookingOpen={isBookingOpen}
          isSoldOut={isSoldOut}
          onBook={onBook}
        />
      </CardContent>
    </Card>
  );
}

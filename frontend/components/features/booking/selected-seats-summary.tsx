'use client';

import { Button } from '@/components/ui/button';
import { Seat } from '@/lib/types';

interface SelectedSeatsSummaryProps {
  selectedSeats: Seat[];
  maxSeatsPerPerson: number;
  isBookingOpen: boolean;
  isSoldOut: boolean;
  onBook: () => void;
}

/**
 * 좌석 선택 화면 하단의 요약 + "예매하기" 액션.
 * RES-004(좌석 한도) 와 RES-003(예매 기간) 을 시각적으로 강제한다.
 */
export function SelectedSeatsSummary({
  selectedSeats,
  maxSeatsPerPerson,
  isBookingOpen,
  isSoldOut,
  onBook,
}: SelectedSeatsSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          선택한 좌석 ({selectedSeats.length}/{maxSeatsPerPerson})
        </p>
        <p className="font-medium text-foreground">
          {selectedSeats.length > 0
            ? selectedSeats.map(s => `${s.row}${s.number}`).join(', ')
            : '좌석을 선택해주세요'}
        </p>
      </div>
      <Button
        size="lg"
        onClick={onBook}
        disabled={selectedSeats.length === 0 || !isBookingOpen || isSoldOut}
      >
        {isSoldOut ? '매진' : `${selectedSeats.length}석 예매하기`}
      </Button>
    </div>
  );
}

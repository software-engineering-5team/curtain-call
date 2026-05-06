'use client';

import { ReactNode, useMemo } from 'react';
import { Seat as SeatType } from '@/lib/types';

interface SeatGridProps {
  seats: SeatType[];
  /** 행 단위로 좌석을 어떻게 그릴지 정하는 렌더 prop. */
  renderSeat: (seat: SeatType) => ReactNode;
  /** 무대 라벨. 기본 "무 대". */
  stageLabel?: string;
}

/**
 * "무대 + 행 라벨 + 좌석 줄" 의 공통 레이아웃.
 * 좌석 자체는 호출자가 renderSeat 로 결정한다(예매 / 좌석 설정 모두 재사용).
 */
export function SeatGrid({ seats, renderSeat, stageLabel = '무 대' }: SeatGridProps) {
  const groupedSeats = useMemo(() => {
    const groups: Record<string, SeatType[]> = {};
    seats.forEach(seat => {
      if (!groups[seat.row]) groups[seat.row] = [];
      groups[seat.row].push(seat);
    });
    return groups;
  }, [seats]);

  return (
    <>
      <div className="mb-8">
        <div className="bg-muted text-muted-foreground text-center py-3 rounded-lg font-medium">
          {stageLabel}
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-fit mx-auto">
          {Object.entries(groupedSeats).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-2 mb-2">
              <span className="w-6 text-sm font-medium text-muted-foreground text-center">{row}</span>
              <div className="flex gap-1.5">
                {rowSeats.map(seat => (
                  <span key={seat.id ?? `${seat.row}-${seat.number}`}>{renderSeat(seat)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

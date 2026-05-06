'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SeatConfigSeat {
  row: string;
  number: number;
  disabled: boolean;
}

interface Props {
  groupedSeats: Record<string, SeatConfigSeat[]>;
  onToggle: (row: string, number: number) => void;
}

/**
 * 좌석 설정 화면의 미리보기 그리드.
 * 사용자(운영자)가 좌석을 클릭해 사용 가능/불가 (SEAT-005) 를 토글할 수 있다.
 */
export function SeatPreviewGrid({ groupedSeats, onToggle }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">좌석 배치도</CardTitle>
        <CardDescription>
          좌석을 클릭하면 사용 가능/불가 상태를 전환할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="w-4 h-4" />
          <AlertTitle>좌석 설정 방법</AlertTitle>
          <AlertDescription>
            사용 불가로 설정할 좌석을 클릭하세요. 다시 클릭하면 사용 가능 상태로 변경됩니다.
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <div className="bg-muted text-muted-foreground text-center py-3 rounded-lg font-medium">
            무 대
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="min-w-fit mx-auto">
            {Object.entries(groupedSeats).map(([row, rowSeats]) => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="w-6 text-sm font-medium text-muted-foreground text-center">{row}</span>
                <div className="flex gap-1.5">
                  {rowSeats.map(seat => (
                    <button
                      key={`${seat.row}-${seat.number}`}
                      type="button"
                      onClick={() => onToggle(seat.row, seat.number)}
                      className={cn(
                        'w-7 h-7 rounded-md border flex items-center justify-center text-xs font-medium transition-all',
                        seat.disabled
                          ? 'bg-muted/50 border-transparent text-muted-foreground/50'
                          : 'bg-primary/20 border-primary/40 text-primary hover:bg-primary/40'
                      )}
                      title={`${seat.row}${seat.number} - ${seat.disabled ? '사용 불가' : '사용 가능'}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary/20 border border-primary/40" />
            <span className="text-muted-foreground">사용 가능</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-muted/50" />
            <span className="text-muted-foreground">사용 불가</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { RentalResponse } from '@/lib/api-types';

interface Props {
  date: Date | undefined;
  startTime: string;
  endTime: string;
  conflicts?: RentalResponse[];
  onRetry: () => void;
}

/** TIME-003/TIME-009 충돌 발생 시 표시. 충돌 구간([start, end])을 함께 표시한다. */
export function RentalConflictCard({ date, startTime, endTime, conflicts, onRetry }: Props) {
  return (
    <Card className="max-w-md w-full">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">신청할 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">
          해당 시간에는 이미 예약된 일정이 있습니다.<br />
          다른 날짜나 시간을 선택해 주세요.
        </p>
        <div className="bg-muted rounded-lg p-4 mb-4 text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">요청 일정</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">날짜</span>
              <span className="font-medium">
                {date && format(date, 'yyyy년 M월 d일', { locale: ko })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">시간</span>
              <span className="font-medium">{startTime} ~ {endTime}</span>
            </div>
          </div>
        </div>

        {conflicts && conflicts.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">
              충돌 일정 ({conflicts.length}건)
            </p>
            <ul className="space-y-2 text-sm">
              {conflicts.map((c) => (
                <li key={c.rentalId} className="flex flex-col gap-0.5">
                  <span className="font-medium">{c.eventName}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Intl.DateTimeFormat('ko-KR', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      timeZone: 'Asia/Seoul',
                    }).format(new Date(c.useDate))}
                    {' '}{c.startTime} ~ {c.endTime}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onRetry} className="w-full">다시 신청하기</Button>
      </CardContent>
    </Card>
  );
}

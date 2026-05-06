import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  date: Date | undefined;
  startTime: string;
  endTime: string;
  onRetry: () => void;
}

/** TIME-003 충돌 발생 시 표시되는 실패 카드. 사용자에게 재시도 액션을 제공한다. */
export function RentalConflictCard({ date, startTime, endTime, onRetry }: Props) {
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
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">요청 날짜</span>
              <span className="font-medium">
                {date && format(date, 'yyyy년 M월 d일', { locale: ko })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">요청 시간</span>
              <span className="font-medium">{startTime} ~ {endTime}</span>
            </div>
          </div>
        </div>
        <Button onClick={onRetry} className="w-full">다시 신청하기</Button>
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  eventName: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

/** 대여 신청 즉시 확정(RES-001) 성공 화면. */
export function RentalSuccessCard({ eventName, date, startTime, endTime }: Props) {
  return (
    <Card className="max-w-md w-full">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">예약이 확정되었습니다</h2>
        <p className="text-muted-foreground mb-6">
          공연장 대여 신청이 완료되었습니다.<br />
          마이페이지에서 예약 내역을 확인하세요.
        </p>
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <Row label="행사명" value={<span className="font-medium">{eventName}</span>} />
            <Row
              label="사용 날짜"
              value={<span className="font-medium">{date && format(date, 'yyyy년 M월 d일', { locale: ko })}</span>}
            />
            <Row label="사용 시간" value={<span className="font-medium">{startTime} ~ {endTime}</span>} />
            <Row label="상태" value={<Badge variant="default">확정</Badge>} />
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/mypage" className="flex-1">
            <Button variant="outline" className="w-full">마이페이지</Button>
          </Link>
          <Link href="/seat-config" className="flex-1">
            <Button className="w-full">좌석 설정하기</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Performance, Seat } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';

interface BookingSuccessCardProps {
  performance: Performance;
  selectedSeats: Seat[];
}

/**
 * 좌석 예매 성공 화면 카드.
 * AGENTS.md §7 의 성공 응답에 명시된 정보(공연명/일시/좌석/좌석 수)를 모두 표시한다.
 */
export function BookingSuccessCard({ performance, selectedSeats }: BookingSuccessCardProps) {
  return (
    <Card className="max-w-md w-full">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">예매가 완료되었습니다</h2>
        <p className="text-muted-foreground mb-6">
          좌석 예매가 성공적으로 완료되었습니다.<br />
          마이페이지에서 예매 내역을 확인하세요.
        </p>
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <Row label="공연명" value={performance.title} />
            <Row label="공연일" value={formatDate(performance.date)} />
            <Row
              label="예매 좌석"
              value={selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
            />
            <Row label="예매 수량" value={`${selectedSeats.length}석`} />
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/performances" className="flex-1">
            <Button variant="outline" className="w-full">목록으로</Button>
          </Link>
          <Link href="/mypage" className="flex-1">
            <Button className="w-full">마이페이지</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

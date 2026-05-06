import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  totalSeats: number;
  availableSeats: number;
  bookingStartDate: Date | undefined;
  bookingEndDate: Date | undefined;
}

/** 좌석 설정 저장 성공 화면. */
export function SeatConfigSuccessCard({
  totalSeats, availableSeats, bookingStartDate, bookingEndDate,
}: Props) {
  return (
    <Card className="max-w-md w-full">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">저장되었습니다</h2>
        <p className="text-muted-foreground mb-6">
          좌석 설정이 저장되었습니다.<br />
          이제 학생들이 공연을 예매할 수 있습니다.
        </p>
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <Row label="총 좌석 수" value={`${totalSeats}석`} />
            <Row label="예매 가능 좌석" value={`${availableSeats}석`} />
            <Row
              label="예매 기간"
              value={
                bookingStartDate && bookingEndDate
                  ? `${format(bookingStartDate, 'M/d')} ~ ${format(bookingEndDate, 'M/d')}`
                  : '미설정'
              }
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/mypage" className="flex-1">
            <Button variant="outline" className="w-full">마이페이지</Button>
          </Link>
          <Link href="/performances" className="flex-1">
            <Button className="w-full">공연 목록</Button>
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

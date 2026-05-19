'use client';

import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Ticket } from 'lucide-react';
import type { BookingResponse } from '@/lib/api-types';

interface Props {
  bookings: BookingResponse[];
  onCancel: (id: number) => void;
}

export function ReservationHistoryList({ bookings, onCancel }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>좌석 예매 내역</CardTitle>
        <CardDescription>예매한 공연 좌석을 확인하고 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map(booking => (
              <BookingItem key={booking.bookingId} booking={booking} onCancel={onCancel} />
            ))}
          </div>
        ) : (
          <Empty
            icon={Ticket}
            title="예매 내역이 없습니다"
            description="관심있는 공연을 찾아 좌석을 예매해보세요"
          >
            <Link href="/performances">
              <Button className="mt-4">공연 둘러보기</Button>
            </Link>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

function BookingItem({
  booking, onCancel,
}: {
  booking: BookingResponse;
  onCancel: (id: number) => void;
}) {
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
      new Date(iso)
    );

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{booking.performanceTitle}</h3>
            <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
              {booking.status === 'CONFIRMED' ? '예매완료' : '취소됨'}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>예매일: {formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>예매 좌석 수: {booking.seatCount}석</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {booking.status === 'CONFIRMED' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  예매 취소
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>예매 취소</AlertDialogTitle>
                  <AlertDialogDescription>
                    정말로 이 예매를 취소하시겠습니까?<br />
                    취소 후에는 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>닫기</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCancel(booking.bookingId)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    취소하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link href={`/performances/${booking.performanceId}`}>
            <Button variant="ghost" size="sm">상세보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

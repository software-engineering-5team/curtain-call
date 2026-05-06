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
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Performance, Reservation } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';

interface Props {
  reservations: Reservation[];
  getPerformance: (performanceId: string) => Performance | undefined;
  onCancel: (reservationId: string) => void;
}

/** 마이페이지 "예매 내역" 탭. CAN-003: 취소 시 좌석 즉시 복귀(서버 책임). */
export function ReservationHistoryList({ reservations, getPerformance, onCancel }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>좌석 예매 내역</CardTitle>
        <CardDescription>예매한 공연 좌석을 확인하고 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map(reservation => {
              const performance = getPerformance(reservation.performanceId);
              if (!performance) return null;
              return (
                <ReservationItem
                  key={reservation.id}
                  reservation={reservation}
                  performance={performance}
                  onCancel={onCancel}
                />
              );
            })}
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

function ReservationItem({
  reservation, performance, onCancel,
}: {
  reservation: Reservation;
  performance: Performance;
  onCancel: (id: string) => void;
}) {
  const seats = reservation.seats.map(s => `${s.row}${s.number}`).join(', ');
  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{performance.title}</h3>
            <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
              {reservation.status === 'confirmed' ? '예매완료' : '취소됨'}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{formatDate(performance.date)}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{performance.venue}</span></div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>좌석: {seats} ({reservation.seats.length}석)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {reservation.status === 'confirmed' && (
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
                    좌석: {seats}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>닫기</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCancel(reservation.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    취소하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link href={`/performances/${performance.id}`}>
            <Button variant="ghost" size="sm">상세보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

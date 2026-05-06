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
import { Building, Calendar, Clock, User, X } from 'lucide-react';
import { VenueRental } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';

interface Props {
  rentals: VenueRental[];
  onCancel: (id: string) => void;
}

/** 마이페이지 "대여 신청" 탭. 본인 소유 검증(CAN-001) 은 서버에서 수행한다. */
export function RentalHistoryList({ rentals, onCancel }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>공연장 대여 신청 내역</CardTitle>
        <CardDescription>신청한 공연장 대여 내역을 확인하고 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {rentals.length > 0 ? (
          <div className="space-y-4">
            {rentals.map(rental => (
              <RentalListItem key={rental.id} rental={rental} onCancel={onCancel} />
            ))}
          </div>
        ) : (
          <Empty
            icon={Building}
            title="대여 신청 내역이 없습니다"
            description="공연장을 대여하고 나만의 행사를 진행해보세요"
          >
            <Link href="/rental">
              <Button className="mt-4">대여 신청하기</Button>
            </Link>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

function RentalListItem({ rental, onCancel }: { rental: VenueRental; onCancel: (id: string) => void }) {
  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{rental.eventName}</h3>
            <Badge variant={rental.status === 'confirmed' ? 'default' : 'secondary'}>
              {rental.status === 'confirmed' ? '확정' : '취소됨'}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <Meta icon={<Calendar className="w-4 h-4" />} text={formatDate(rental.useDate)} />
            <Meta icon={<Clock className="w-4 h-4" />} text={`${rental.startTime} ~ ${rental.endTime}`} />
            {rental.clubName && <Meta icon={<User className="w-4 h-4" />} text={rental.clubName} />}
          </div>
        </div>
        <div className="flex gap-2">
          {rental.status === 'confirmed' && (
            <>
              <Link href="/seat-config">
                <Button variant="outline" size="sm">좌석 설정</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>대여 취소</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말로 이 대여 신청을 취소하시겠습니까?<br />
                      취소 후에는 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>닫기</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel(rental.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      취소하기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}<span>{text}</span>
    </div>
  );
}

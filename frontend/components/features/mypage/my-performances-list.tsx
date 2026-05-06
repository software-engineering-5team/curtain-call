import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, Ticket } from 'lucide-react';
import { Performance } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/mock-data';

interface Props { performances: Performance[] }

/** 내가 등록(주최)한 공연 목록. */
export function MyPerformancesList({ performances }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>내가 등록한 공연</CardTitle>
        <CardDescription>등록한 공연 정보를 확인하고 좌석을 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {performances.length > 0 ? (
          <div className="space-y-4">
            {performances.map(performance => (
              <div
                key={performance.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{performance.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(performance.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(performance.startTime)} ~ {formatTime(performance.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        <span>예매 {performance.totalSeats - performance.availableSeats}석 / {performance.totalSeats}석</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/seat-config">
                      <Button variant="outline" size="sm">좌석 관리</Button>
                    </Link>
                    <Link href={`/performances/${performance.id}`}>
                      <Button variant="ghost" size="sm">상세보기</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={Calendar}
            title="등록한 공연이 없습니다"
            description="공연장을 대여한 후 공연 정보를 등록해보세요"
          >
            <Link href="/rental">
              <Button className="mt-4">공연장 대여하기</Button>
            </Link>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

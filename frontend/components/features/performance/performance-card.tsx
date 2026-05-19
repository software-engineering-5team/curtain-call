import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import type { PerformanceResponse } from '@/lib/api-types';

interface PerformanceCardProps {
  performance: PerformanceResponse;
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  const now = new Date();
  const bookingStart = new Date(performance.bookingStartAt);
  const bookingEnd = new Date(performance.bookingEndAt);
  const isBookingOpen = now >= bookingStart && now <= bookingEnd;
  const isSoldOut = performance.availableSeats === 0;

  const formatKorDate = (iso: string) =>
    new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
      new Date(iso)
    );

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <div className="aspect-[3/4] relative bg-muted overflow-hidden">
        {performance.posterImageUrl ? (
          <img
            src={performance.posterImageUrl}
            alt={performance.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/30">{performance.title.charAt(0)}</span>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-1">매진</Badge>
          </div>
        )}
        {!isBookingOpen && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-card/90">예매 예정</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {performance.title}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>예매 마감: {formatKorDate(performance.bookingEndAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>잔여 {performance.availableSeats}석 / {performance.totalSeats}석</span>
          </div>
        </div>

        <Link href={`/performances/${performance.performanceId}`}>
          <Button
            className="w-full"
            variant={isBookingOpen && !isSoldOut ? 'default' : 'secondary'}
            disabled={isSoldOut}
          >
            {isSoldOut ? '매진' : isBookingOpen ? '예매하기' : '상세보기'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

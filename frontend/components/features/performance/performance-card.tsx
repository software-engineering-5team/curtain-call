import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Performance } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';

interface PerformanceCardProps {
  performance: Performance;
}

/** 공연 한 건을 카드로 표시. 목록/홈/검색 결과에서 재사용된다. */
export function PerformanceCard({ performance }: PerformanceCardProps) {
  const isBookingOpen = new Date() >= performance.bookingStartDate && new Date() <= performance.bookingEndDate;
  const isSoldOut = performance.availableSeats === 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <div className="aspect-[3/4] relative bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary/30">
            {performance.title.charAt(0)}
          </span>
        </div>
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
            <span>{formatDate(performance.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{performance.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>잔여 {performance.availableSeats}석 / {performance.totalSeats}석</span>
          </div>
        </div>

        <Link href={`/performances/${performance.id}`}>
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

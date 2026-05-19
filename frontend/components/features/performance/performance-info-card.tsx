import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users } from 'lucide-react';
import type { PerformanceResponse } from '@/lib/api-types';

interface PerformanceInfoCardProps {
  performance: PerformanceResponse;
  isSoldOut: boolean;
}

export function PerformanceInfoCard({ performance, isSoldOut }: PerformanceInfoCardProps) {
  const formatKorDate = (iso: string) =>
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(new Date(iso));

  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative bg-muted overflow-hidden rounded-t-lg">
          {performance.posterImageUrl ? (
            <img
              src={performance.posterImageUrl}
              alt={performance.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary/30">{performance.title.charAt(0)}</span>
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-1">매진</Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">{performance.title}</h1>

          <div className="space-y-3 mb-6">
            <Meta
              icon={<Users className="w-4 h-4 text-muted-foreground" />}
              text={`잔여 ${performance.availableSeats}석 / ${performance.totalSeats}석`}
            />
            <Meta
              icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
              text={`예매 기간: ${formatKorDate(performance.bookingStartAt)} ~ ${formatKorDate(performance.bookingEndAt)}`}
            />
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="font-semibold text-foreground mb-2">공연 소개</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {performance.description || '공연 소개가 없습니다.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}

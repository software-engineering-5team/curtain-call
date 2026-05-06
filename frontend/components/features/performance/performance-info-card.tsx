import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Performance } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/mock-data';

interface PerformanceInfoCardProps {
  performance: Performance;
  isSoldOut: boolean;
}

/** 공연 상세 페이지의 좌측 정보 카드(포스터 + 메타 + 설명 + 예매 기간). */
export function PerformanceInfoCard({ performance, isSoldOut }: PerformanceInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative bg-muted overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">
              {performance.title.charAt(0)}
            </span>
          </div>
          {isSoldOut && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-1">매진</Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">{performance.title}</h1>

          <div className="space-y-3 mb-6">
            <Meta icon={<Calendar className="w-4 h-4 text-muted-foreground" />} text={formatDate(performance.date)} />
            <Meta
              icon={<Clock className="w-4 h-4 text-muted-foreground" />}
              text={`${formatTime(performance.startTime)} ~ ${formatTime(performance.endTime)}`}
            />
            <Meta icon={<MapPin className="w-4 h-4 text-muted-foreground" />} text={performance.venue} />
            <Meta
              icon={<Users className="w-4 h-4 text-muted-foreground" />}
              text={`잔여 ${performance.availableSeats}석 / ${performance.totalSeats}석`}
            />
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="font-semibold text-foreground mb-2">공연 소개</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{performance.description}</p>
          </div>

          <Separator className="my-4" />

          <div className="text-sm text-muted-foreground">
            <p>예매 기간: {formatDate(performance.bookingStartDate)} ~ {formatDate(performance.bookingEndDate)}</p>
            <p>1인당 최대 {performance.maxSeatsPerPerson}석까지 예매 가능</p>
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

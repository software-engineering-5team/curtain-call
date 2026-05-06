import { Performance } from '@/lib/types';
import { Empty } from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { Ticket } from 'lucide-react';
import { PerformanceCard } from './performance-card';

interface PerformanceListProps {
  title: string;
  performances: Performance[];
  badgeVariant?: 'secondary' | 'outline';
  emptyTitle?: string;
  emptyDescription?: string;
  faded?: boolean;
}

/** 제목 + 카운트 배지 + 카드 그리드. 예정/지난 공연 모두 재사용. */
export function PerformanceList({
  title,
  performances,
  badgeVariant = 'secondary',
  emptyTitle,
  emptyDescription,
  faded = false,
}: PerformanceListProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Badge variant={badgeVariant}>{performances.length}개</Badge>
      </div>

      {performances.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${faded ? 'opacity-60' : ''}`}>
          {performances.map(p => <PerformanceCard key={p.id} performance={p} />)}
        </div>
      ) : (
        <Empty
          icon={Ticket}
          title={emptyTitle ?? '공연이 없습니다'}
          description={emptyDescription ?? '아직 등록된 공연이 없습니다.'}
        />
      )}
    </section>
  );
}

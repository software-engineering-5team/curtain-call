import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Performance } from '@/lib/types';
import { PerformanceCard } from '@/components/features/performance';

interface Props { performances: Performance[] }

/** 홈 페이지 "예정된 공연" 섹션. */
export function UpcomingPerformancesSection({ performances }: Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">예정된 공연</h2>
            <p className="text-muted-foreground">곧 진행될 공연을 확인하고 예매하세요</p>
          </div>
          <Link href="/performances" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {performances.map(performance => (
            <PerformanceCard key={performance.id} performance={performance} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/performances">
            <Button variant="outline" className="gap-2">
              전체 공연 보기 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

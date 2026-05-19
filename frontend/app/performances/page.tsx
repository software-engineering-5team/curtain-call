'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PerformanceList } from '@/components/features/performance';
import { performancesApi } from '@/lib/api';
import type { PerformanceResponse } from '@/lib/api-types';
import { Spinner } from '@/components/ui/spinner';

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<PerformanceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performancesApi
      .list(0, 50)
      .then(res => setPerformances(res.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = performances.filter(p => new Date(p.bookingEndAt) >= now);
  const past = performances.filter(p => new Date(p.bookingEndAt) < now);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">공연 목록</h1>
            <p className="text-muted-foreground">복지관 공연장에서 진행되는 공연을 확인하고 예매하세요</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <>
              <PerformanceList
                title="예정된 공연"
                performances={upcoming}
                badgeVariant="secondary"
                emptyTitle="예정된 공연이 없습니다"
                emptyDescription="아직 등록된 공연이 없습니다. 나중에 다시 확인해주세요."
              />
              {past.length > 0 && (
                <PerformanceList
                  title="지난 공연"
                  performances={past}
                  badgeVariant="outline"
                  faded
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

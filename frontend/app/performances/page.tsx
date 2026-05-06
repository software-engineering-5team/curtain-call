import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PerformanceList } from '@/components/features/performance';
import { performances } from '@/lib/mock-data';

export default function PerformancesPage() {
  const upcomingPerformances = performances.filter(p => p.date >= new Date());
  const pastPerformances = performances.filter(p => p.date < new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName="홍길동" />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">공연 목록</h1>
            <p className="text-muted-foreground">
              복지관 공연장에서 진행되는 공연을 확인하고 예매하세요
            </p>
          </div>

          <PerformanceList
            title="예정된 공연"
            performances={upcomingPerformances}
            badgeVariant="secondary"
            emptyTitle="예정된 공연이 없습니다"
            emptyDescription="아직 등록된 공연이 없습니다. 나중에 다시 확인해주세요."
          />

          {pastPerformances.length > 0 && (
            <PerformanceList
              title="지난 공연"
              performances={pastPerformances}
              badgeVariant="outline"
              faded
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { performances } from '@/lib/mock-data';
import {
  HeroSection,
  FeaturesSection,
  UpcomingPerformancesSection,
  HowItWorksSection,
  CtaSection,
} from '@/components/features/home';

export default function HomePage() {
  const upcomingPerformances = performances.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName="홍길동" />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <UpcomingPerformancesSection performances={upcomingPerformances} />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

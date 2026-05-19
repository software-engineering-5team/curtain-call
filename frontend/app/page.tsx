'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { performancesApi } from '@/lib/api';
import type { PerformanceResponse } from '@/lib/api-types';
import {
  HeroSection,
  FeaturesSection,
  UpcomingPerformancesSection,
  HowItWorksSection,
  CtaSection,
} from '@/components/features/home';

export default function HomePage() {
  const [performances, setPerformances] = useState<PerformanceResponse[]>([]);

  useEffect(() => {
    performancesApi
      .list(0, 4)
      .then(res => setPerformances(res.content))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <UpcomingPerformancesSection performances={performances} />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

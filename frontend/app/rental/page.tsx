'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Spinner } from '@/components/ui/spinner';
import {
  RentalForm,
  RentalSuccessCard,
  RentalConflictCard,
  type RentalSubmissionStatus,
  type RentalSubmitPayload,
} from '@/components/features/rental';
import type { RentalResponse } from '@/lib/api-types';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';

export default function RentalPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submissionStatus, setSubmissionStatus] = useState<RentalSubmissionStatus>('idle');
  const [submittedPayload, setSubmittedPayload] = useState<RentalSubmitPayload | null>(null);
  const [createdRental, setCreatedRental] = useState<RentalResponse | null>(null);
  const [conflictingRentals, setConflictingRentals] = useState<RentalResponse[]>([]);

  // COMMON-003: 비로그인 시 홈으로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      showAuthRequiredToast();
      router.replace('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  const reset = () => {
    setSubmissionStatus('idle');
    setSubmittedPayload(null);
    setCreatedRental(null);
    setConflictingRentals([]);
  };

  if (submissionStatus === 'success' && submittedPayload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <RentalSuccessCard
            eventName={submittedPayload.eventName}
            date={submittedPayload.date}
            startTime={submittedPayload.startTime}
            endTime={submittedPayload.endTime}
            rentalId={createdRental?.rentalId}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (submissionStatus === 'conflict' && submittedPayload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <RentalConflictCard
            date={submittedPayload.date}
            startTime={submittedPayload.startTime}
            endTime={submittedPayload.endTime}
            conflicts={conflictingRentals}
            onRetry={reset}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>

          <RentalForm
            onSuccess={(payload, rental) => {
              setSubmittedPayload(payload);
              setCreatedRental(rental);
              setSubmissionStatus('success');
            }}
            onConflict={(payload, conflicts) => {
              setSubmittedPayload(payload);
              setConflictingRentals(conflicts);
              setSubmissionStatus('conflict');
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

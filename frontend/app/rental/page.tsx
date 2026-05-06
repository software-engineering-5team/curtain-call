'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  RentalForm,
  RentalSuccessCard,
  RentalConflictCard,
  type RentalSubmissionStatus,
  type RentalSubmitPayload,
  type ExistingReservation,
} from '@/components/features/rental';

// Mock existing reservations for conflict check
const existingReservations: ExistingReservation[] = [
  { date: '2026-05-20', startTime: '18:00', endTime: '22:00' },
  { date: '2026-05-25', startTime: '17:00', endTime: '21:00' },
];

export default function RentalPage() {
  const [submissionStatus, setSubmissionStatus] = useState<RentalSubmissionStatus>('idle');
  const [submittedPayload, setSubmittedPayload] = useState<RentalSubmitPayload | null>(null);

  const reset = () => {
    setSubmissionStatus('idle');
    setSubmittedPayload(null);
  };

  if (submissionStatus === 'success' && submittedPayload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userName="홍길동" />
        <main className="flex-1 flex items-center justify-center p-4">
          <RentalSuccessCard
            eventName={submittedPayload.eventName}
            date={submittedPayload.date}
            startTime={submittedPayload.startTime}
            endTime={submittedPayload.endTime}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (submissionStatus === 'conflict' && submittedPayload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userName="홍길동" />
        <main className="flex-1 flex items-center justify-center p-4">
          <RentalConflictCard
            date={submittedPayload.date}
            startTime={submittedPayload.startTime}
            endTime={submittedPayload.endTime}
            onRetry={reset}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName="홍길동" />

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
            existingReservations={existingReservations}
            onSuccess={(payload) => {
              setSubmittedPayload(payload);
              setSubmissionStatus('success');
            }}
            onConflict={(payload) => {
              setSubmittedPayload(payload);
              setSubmissionStatus('conflict');
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

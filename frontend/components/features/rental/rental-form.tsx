'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Info } from 'lucide-react';
import { RentalApplicantSection } from './rental-applicant-section';
import { RentalEventSection } from './rental-event-section';
import { RentalScheduleSection } from './rental-schedule-section';
import { RentalFormData, initialRentalFormData, RentalSubmissionStatus } from './rental-form-types';
import { rentalsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { RentalResponse } from '@/lib/api-types';

export interface RentalSubmitPayload extends RentalFormData {
  date: Date;
  startTime: string;
  endTime: string;
}

interface Props {
  onSuccess: (payload: RentalSubmitPayload, rental: RentalResponse) => void;
  onConflict: (payload: RentalSubmitPayload, conflicts: RentalResponse[]) => void;
}

export function RentalForm({ onSuccess, onConflict }: Props) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formData, setFormData] = useState<RentalFormData>({
    ...initialRentalFormData,
    applicantName: user?.name ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const formatTime = (t: string) => t.includes(':') && t.split(':').length === 2 ? t + ':00' : t;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);
    setError('');

    const payload: RentalSubmitPayload = { ...formData, date, startTime, endTime };
    const useDateStr = formatDate(date);
    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);

    // Check for time conflict first
    try {
      const check = await rentalsApi.check({
        useDate: useDateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
      });
      if (!check.available) {
        onConflict(payload, check.conflicts ?? []);
        setSubmitting(false);
        return;
      }
    } catch {
      // If check fails, proceed to attempt create (server will validate)
    }

    // Create rental
    try {
      const rental = await rentalsApi.create({
        applicantName: formData.applicantName,
        studentId: formData.studentId,
        phone: formData.contact,
        clubName: formData.clubName || undefined,
        activityName: formData.activityName || undefined,
        eventName: formData.eventName,
        eventDescription: formData.eventDescription || undefined,
        useDate: useDateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        expectedAttendees: Number(formData.expectedAttendees),
      });
      onSuccess(payload, rental);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '대여 신청에 실패했습니다.';
      if (msg.includes('conflict') || msg.includes('TIME_CONFLICT')) {
        onConflict(payload, []);
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmittable =
    !!date &&
    !!startTime &&
    !!endTime &&
    !!formData.contact &&
    !!formData.eventName &&
    !!formData.eventDescription &&
    !!formData.expectedAttendees &&
    !submitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">공연장 대여 신청</CardTitle>
        <CardDescription>
          복지관 공연장 대여를 신청합니다. 신청 즉시 예약이 확정됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="w-4 h-4" />
          <AlertTitle>안내</AlertTitle>
          <AlertDescription>
            같은 날짜와 시간에 이미 예약된 일정이 있는 경우 신청이 불가합니다.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <RentalApplicantSection formData={formData} onChange={handleInputChange} />
          <RentalEventSection formData={formData} onChange={handleInputChange} />
          <RentalScheduleSection
            date={date}
            onDateChange={setDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            endTime={endTime}
            onEndTimeChange={setEndTime}
          />
          <Button type="submit" size="lg" className="w-full" disabled={!isSubmittable}>
            {submitting ? (
              <span className="flex items-center gap-2"><Spinner /> 처리 중...</span>
            ) : (
              '대여 신청하기'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export type { RentalSubmissionStatus };

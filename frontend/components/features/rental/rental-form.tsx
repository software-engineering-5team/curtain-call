'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { RentalApplicantSection } from './rental-applicant-section';
import { RentalEventSection } from './rental-event-section';
import { RentalScheduleSection } from './rental-schedule-section';
import { hasTimeConflict, ExistingReservation } from './rental-rules';
import { RentalFormData, initialRentalFormData, RentalSubmissionStatus } from './rental-form-types';

export interface RentalSubmitPayload extends RentalFormData {
  date: Date;
  startTime: string;
  endTime: string;
}

interface Props {
  existingReservations: ExistingReservation[];
  onSuccess: (payload: RentalSubmitPayload) => void;
  onConflict: (payload: RentalSubmitPayload) => void;
}

/** 공연장 대여 신청 폼 컨테이너. 충돌 감지(TIME-003)는 rental-rules 의 순수 함수에 위임. */
export function RentalForm({ existingReservations, onSuccess, onConflict }: Props) {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formData, setFormData] = useState<RentalFormData>(initialRentalFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const payload: RentalSubmitPayload = { ...formData, date, startTime, endTime };
    if (hasTimeConflict({ date, startTime, endTime, existing: existingReservations })) {
      onConflict(payload);
    } else {
      onSuccess(payload);
    }
  };

  const isSubmittable =
    !!date &&
    !!startTime &&
    !!endTime &&
    !!formData.contact &&
    !!formData.eventName &&
    !!formData.eventDescription &&
    !!formData.expectedAttendees;

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
            대여 신청하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export type { RentalSubmissionStatus };

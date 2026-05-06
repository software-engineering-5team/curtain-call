'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  bookingStartDate: Date | undefined;
  setBookingStartDate: (d: Date | undefined) => void;
  bookingEndDate: Date | undefined;
  setBookingEndDate: (d: Date | undefined) => void;
  maxSeatsPerPerson: number;
  setMaxSeatsPerPerson: (n: number) => void;
}

/** 예매 기간 + 1인당 한도. RES-003, RES-004, TIME-008 을 입력으로 받는다. */
export function BookingSettingsPanel({
  bookingStartDate, setBookingStartDate,
  bookingEndDate, setBookingEndDate,
  maxSeatsPerPerson, setMaxSeatsPerPerson,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">예매 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DatePickerField label="예매 시작일" value={bookingStartDate} onChange={setBookingStartDate} />
        <DatePickerField label="예매 종료일" value={bookingEndDate} onChange={setBookingEndDate} />

        <div className="space-y-2">
          <Label htmlFor="maxSeats">1인당 최대 예매 수</Label>
          <Input
            id="maxSeats"
            type="number"
            value={maxSeatsPerPerson}
            onChange={(e) => setMaxSeatsPerPerson(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function DatePickerField({
  label, value, onChange,
}: { label: string; value: Date | undefined; onChange: (d: Date | undefined) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'yyyy년 M월 d일', { locale: ko }) : '날짜 선택'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} locale={ko} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TIME_OPTIONS } from './rental-rules';

interface Props {
  date: Date | undefined;
  onDateChange: (d: Date | undefined) => void;
  startTime: string;
  onStartTimeChange: (t: string) => void;
  endTime: string;
  onEndTimeChange: (t: string) => void;
}

/** 사용 일정 입력. TIME-001(시작 < 종료), TIME-005(미래 일자만) 을 UI에서 강제. */
export function RentalScheduleSection({
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground border-b border-border pb-2">사용 일정</h3>

      <div className="space-y-2">
        <Label>사용 날짜 *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'yyyy년 M월 d일 (EEE)', { locale: ko }) : '날짜를 선택하세요'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={(d) => d < new Date()}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>시작 시간 *</Label>
          <Select value={startTime} onValueChange={onStartTimeChange} required>
            <SelectTrigger>
              <SelectValue placeholder="시작 시간" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>종료 시간 *</Label>
          <Select value={endTime} onValueChange={onEndTimeChange} required>
            <SelectTrigger>
              <SelectValue placeholder="종료 시간" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.filter(time => time > startTime).map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

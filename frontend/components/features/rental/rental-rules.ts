import { format } from 'date-fns';

export interface ExistingReservation {
  date: string; // 'yyyy-MM-dd'
  startTime: string; // 'HH:mm'
  endTime: string;
}

/**
 * TIME-002 의 충돌 공식: A.start < B.end && A.end > B.start.
 * 분 단위(HHmm 정수)로 변환하여 비교한다.
 */
export function hasTimeConflict(opts: {
  date: Date;
  startTime: string;
  endTime: string;
  existing: ExistingReservation[];
}): boolean {
  const { date, startTime, endTime, existing } = opts;
  if (!startTime || !endTime) return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  const reqStart = parseHHmm(startTime);
  const reqEnd = parseHHmm(endTime);
  return existing.some(r => {
    if (r.date !== dateStr) return false;
    const resStart = parseHHmm(r.startTime);
    const resEnd = parseHHmm(r.endTime);
    return reqStart < resEnd && reqEnd > resStart;
  });
}

function parseHHmm(t: string): number {
  return parseInt(t.replace(':', ''), 10);
}

export const TIME_OPTIONS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
] as const;

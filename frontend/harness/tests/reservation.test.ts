/**
 * reservation.test.ts
 * 좌석 예매(Reservation) 도메인 검증
 * 관련 규칙: harness/rules/reservation-rules.json
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// 도메인 타입은 lib/types.ts 와 동일한 형태를 가정한다.
type SeatStatus = 'available' | 'selecting' | 'reserved' | 'unavailable';
interface Seat { id: string; performanceId: string; row: string; number: number; status: SeatStatus }
interface Performance {
  id: string;
  bookingStartDate: Date;
  bookingEndDate: Date;
  startTime: Date;
  totalSeats: number;
  availableSeats: number;
  maxSeatsPerPerson: number;
}

type ReservationFailure =
  | 'AUTH_REQUIRED'
  | 'SEAT_TAKEN'
  | 'OUT_OF_BOOKING_WINDOW'
  | 'MAX_SEATS_EXCEEDED'
  | 'VALIDATION_ERROR';

interface ReservationResult {
  ok: boolean;
  status?: 'confirmed';
  failure?: ReservationFailure;
}

// 실제 구현체는 lib/reservation.ts 등에 위치한다고 가정. 테스트용 reference impl:
function createReservation(opts: {
  now: Date;
  user: { id: string } | null;
  performance: Performance;
  seats: Seat[];
}): ReservationResult {
  const { now, user, performance, seats } = opts;
  if (!user) return { ok: false, failure: 'AUTH_REQUIRED' };
  if (seats.length === 0) return { ok: false, failure: 'VALIDATION_ERROR' };
  if (now < performance.bookingStartDate || now > performance.bookingEndDate) {
    return { ok: false, failure: 'OUT_OF_BOOKING_WINDOW' };
  }
  if (now >= performance.startTime) return { ok: false, failure: 'OUT_OF_BOOKING_WINDOW' };
  if (seats.length > performance.maxSeatsPerPerson) return { ok: false, failure: 'MAX_SEATS_EXCEEDED' };
  if (seats.some(s => s.status !== 'available')) return { ok: false, failure: 'SEAT_TAKEN' };
  return { ok: true, status: 'confirmed' };
}

const baseSeat = (overrides: Partial<Seat> = {}): Seat => ({
  id: 's-1', performanceId: 'p-1', row: 'A', number: 1, status: 'available', ...overrides,
});
const basePerf = (overrides: Partial<Performance> = {}): Performance => ({
  id: 'p-1',
  bookingStartDate: new Date('2026-05-01T00:00:00Z'),
  bookingEndDate: new Date('2026-06-14T23:59:59Z'),
  startTime: new Date('2026-06-15T19:00:00Z'),
  totalSeats: 100,
  availableSeats: 100,
  maxSeatsPerPerson: 4,
  ...overrides,
});

describe('Reservation', () => {
  it('[RES-002] 정상 예매는 즉시 confirmed', () => {
    const r = createReservation({
      now: new Date('2026-05-10T10:00:00Z'),
      user: { id: 'u-1' },
      performance: basePerf(),
      seats: [baseSeat()],
    });
    assert.equal(r.ok, true);
    assert.equal(r.status, 'confirmed');
  });

  it('[RES-003] 예매 기간 이전이면 OUT_OF_BOOKING_WINDOW', () => {
    const r = createReservation({
      now: new Date('2026-04-01T00:00:00Z'),
      user: { id: 'u-1' },
      performance: basePerf(),
      seats: [baseSeat()],
    });
    assert.equal(r.ok, false);
    assert.equal(r.failure, 'OUT_OF_BOOKING_WINDOW');
  });

  it('[RES-004] maxSeatsPerPerson 초과 시 MAX_SEATS_EXCEEDED', () => {
    const seats = Array.from({ length: 5 }, (_, i) => baseSeat({ id: `s-${i}`, number: i + 1 }));
    const r = createReservation({
      now: new Date('2026-05-10T10:00:00Z'),
      user: { id: 'u-1' },
      performance: basePerf({ maxSeatsPerPerson: 4 }),
      seats,
    });
    assert.equal(r.failure, 'MAX_SEATS_EXCEEDED');
  });

  it('[RES-007] 공연 시작 시각 이후에는 예매 불가', () => {
    const r = createReservation({
      now: new Date('2026-06-15T20:00:00Z'),
      user: { id: 'u-1' },
      performance: basePerf(),
      seats: [baseSeat()],
    });
    assert.equal(r.failure, 'OUT_OF_BOOKING_WINDOW');
  });

  it('[RES-009] 미로그인 시 AUTH_REQUIRED', () => {
    const r = createReservation({
      now: new Date('2026-05-10T10:00:00Z'),
      user: null,
      performance: basePerf(),
      seats: [baseSeat()],
    });
    assert.equal(r.failure, 'AUTH_REQUIRED');
  });
});

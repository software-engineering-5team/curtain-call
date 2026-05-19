/**
 * 예매 도메인 검증 로직 (harness/rules/reservation-rules.json 기준)
 */

export type SeatStatus = 'available' | 'selecting' | 'reserved' | 'unavailable';

export interface ReservationSeat {
  id: string;
  performanceId: string;
  row: string;
  number: number;
  status: SeatStatus;
}

export interface ReservationPerformance {
  id: string;
  bookingStartDate: Date;
  bookingEndDate: Date;
  startTime: Date;
  totalSeats: number;
  availableSeats: number;
  maxSeatsPerPerson: number;
}

export type ReservationFailure =
  | 'AUTH_REQUIRED'
  | 'SEAT_TAKEN'
  | 'OUT_OF_BOOKING_WINDOW'
  | 'MAX_SEATS_EXCEEDED'
  | 'VALIDATION_ERROR';

export type ReservationResult =
  | { ok: true; status: 'confirmed' }
  | { ok: false; failure: ReservationFailure };

/** RES-002 ~ RES-009: 예매 가능 여부를 클라이언트 사이드에서 사전 검증한다. */
export function createReservation(opts: {
  now: Date;
  user: { id: string } | null;
  performance: ReservationPerformance;
  seats: ReservationSeat[];
}): ReservationResult {
  const { now, user, performance, seats } = opts;

  if (!user) return { ok: false, failure: 'AUTH_REQUIRED' };          // RES-009
  if (seats.length === 0) return { ok: false, failure: 'VALIDATION_ERROR' };

  // RES-003: 예매 기간 체크
  if (now < performance.bookingStartDate || now > performance.bookingEndDate) {
    return { ok: false, failure: 'OUT_OF_BOOKING_WINDOW' };
  }

  // RES-007: 공연 시작 이후 예매 불가
  if (now >= performance.startTime) {
    return { ok: false, failure: 'OUT_OF_BOOKING_WINDOW' };
  }

  // RES-004: 인당 최대 좌석 초과
  if (seats.length > performance.maxSeatsPerPerson) {
    return { ok: false, failure: 'MAX_SEATS_EXCEEDED' };
  }

  // RES-006: 선점되지 않은 좌석만 예매 가능
  if (seats.some(s => s.status !== 'available')) {
    return { ok: false, failure: 'SEAT_TAKEN' };
  }

  return { ok: true, status: 'confirmed' };
}

export type CancelFailure = 'NOT_OWNER' | 'PAST_EVENT' | 'ALREADY_CANCELLED';
export type CancelResult = { ok: true; status: 'cancelled' } | { ok: false; failure: CancelFailure };

/** CAN-001 ~ CAN-006: 대여 취소 정책 검증 */
export function cancelRental(
  now: Date,
  actorUserId: string,
  rental: { userId: string; useDate: Date; status: 'confirmed' | 'cancelled' },
): CancelResult {
  if (rental.userId !== actorUserId) return { ok: false, failure: 'NOT_OWNER' };
  if (rental.status === 'cancelled') return { ok: false, failure: 'ALREADY_CANCELLED' };
  if (now > rental.useDate) return { ok: false, failure: 'PAST_EVENT' };
  return { ok: true, status: 'cancelled' };
}

/** CAN-004: 예매 취소 정책 검증 */
export function cancelReservation(
  now: Date,
  actorUserId: string,
  reservation: {
    userId: string;
    performance: { startTime: Date };
    status: 'confirmed' | 'cancelled';
  },
): CancelResult {
  if (reservation.userId !== actorUserId) return { ok: false, failure: 'NOT_OWNER' };
  if (reservation.status === 'cancelled') return { ok: false, failure: 'ALREADY_CANCELLED' };
  if (now >= reservation.performance.startTime) return { ok: false, failure: 'PAST_EVENT' };
  return { ok: true, status: 'cancelled' };
}

/** TIME-002: 두 시간 구간이 겹치는지 판정한다. */
export function hasTimeOverlap(
  a: { startTime: Date; endTime: Date },
  b: { startTime: Date; endTime: Date },
): boolean {
  return a.startTime < b.endTime && a.endTime > b.startTime;
}

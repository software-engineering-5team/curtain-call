/**
 * cancellation.test.ts
 * 대여 / 예매 취소 정책
 * 관련 규칙: harness/rules/cancellation-rules.json
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type Status = 'confirmed' | 'cancelled';

interface Rental { id: string; userId: string; useDate: Date; status: Status }
interface Reservation { id: string; userId: string; performance: { startTime: Date }; seats: { row: string; number: number }[]; status: Status }

type CancelFailure = 'NOT_OWNER' | 'PAST_EVENT' | 'ALREADY_CANCELLED';
type CancelResult = { ok: true; status: 'cancelled' } | { ok: false; failure: CancelFailure };

function cancelRental(now: Date, actorUserId: string, rental: Rental): CancelResult {
  if (rental.userId !== actorUserId) return { ok: false, failure: 'NOT_OWNER' };
  if (rental.status === 'cancelled') return { ok: false, failure: 'ALREADY_CANCELLED' };
  if (now > rental.useDate) return { ok: false, failure: 'PAST_EVENT' };
  return { ok: true, status: 'cancelled' };
}

function cancelReservation(now: Date, actorUserId: string, r: Reservation): CancelResult {
  if (r.userId !== actorUserId) return { ok: false, failure: 'NOT_OWNER' };
  if (r.status === 'cancelled') return { ok: false, failure: 'ALREADY_CANCELLED' };
  if (now >= r.performance.startTime) return { ok: false, failure: 'PAST_EVENT' };
  return { ok: true, status: 'cancelled' };
}

describe('Cancellation', () => {
  it('[CAN-001] 본인이 아닌 유저는 대여를 취소할 수 없다', () => {
    const r: Rental = { id: 'r1', userId: 'u1', useDate: new Date('2026-12-01'), status: 'confirmed' };
    const result = cancelRental(new Date('2026-05-10'), 'u2', r);
    assert.equal(result.ok, false);
    assert.equal(result.ok ? null : result.failure, 'NOT_OWNER');
  });

  it('[CAN-002] 정상 취소는 status=cancelled', () => {
    const r: Rental = { id: 'r1', userId: 'u1', useDate: new Date('2026-12-01'), status: 'confirmed' };
    const result = cancelRental(new Date('2026-05-10'), 'u1', r);
    assert.equal(result.ok, true);
    assert.equal(result.ok && result.status, 'cancelled');
  });

  it('[CAN-004] 공연 시작 시각 이후 예매 취소는 거부', () => {
    const reservation: Reservation = {
      id: 'res-1',
      userId: 'u1',
      performance: { startTime: new Date('2026-06-15T19:00:00Z') },
      seats: [{ row: 'A', number: 1 }],
      status: 'confirmed',
    };
    const result = cancelReservation(new Date('2026-06-15T20:00:00Z'), 'u1', reservation);
    assert.equal(result.ok, false);
    assert.equal(result.ok ? null : result.failure, 'PAST_EVENT');
  });

  it('[CAN-005] 사용 일자 경과 후 대여 취소는 거부', () => {
    const r: Rental = { id: 'r1', userId: 'u1', useDate: new Date('2026-04-01'), status: 'confirmed' };
    const result = cancelRental(new Date('2026-05-10'), 'u1', r);
    assert.equal(result.ok ? null : result.failure, 'PAST_EVENT');
  });

  it('[CAN-006] 이미 cancelled 인 레코드 재취소는 ALREADY_CANCELLED 로 idempotent 처리', () => {
    const r: Rental = { id: 'r1', userId: 'u1', useDate: new Date('2026-12-01'), status: 'cancelled' };
    const result = cancelRental(new Date('2026-05-10'), 'u1', r);
    assert.equal(result.ok ? null : result.failure, 'ALREADY_CANCELLED');
  });
});

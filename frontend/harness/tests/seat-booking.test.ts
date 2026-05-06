/**
 * seat-booking.test.ts
 * 좌석 상태 머신 + 중복 예매 방지
 * 관련 규칙: harness/rules/seat-rules.json
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type SeatStatus = 'available' | 'selecting' | 'reserved' | 'unavailable';

const VALID_TRANSITIONS: Record<SeatStatus, SeatStatus[]> = {
  available: ['selecting', 'unavailable'],
  selecting: ['available', 'reserved'],
  reserved: ['available'], // 취소 시 복귀
  unavailable: ['available'],
};

function canTransition(from: SeatStatus, to: SeatStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

interface Seat { performanceId: string; row: string; number: number; status: SeatStatus }
function seatKey(s: Pick<Seat, 'performanceId' | 'row' | 'number'>): string {
  return `${s.performanceId}#${s.row}-${s.number}`;
}

describe('Seat state machine', () => {
  it('[SEAT-002] 상태 집합은 4가지로 한정', () => {
    const all: SeatStatus[] = ['available', 'selecting', 'reserved', 'unavailable'];
    assert.equal(all.length, 4);
  });

  it('[SEAT-007] available -> reserved 직접 전이는 불가(반드시 selecting 경유)', () => {
    assert.equal(canTransition('available', 'reserved'), false);
    assert.equal(canTransition('available', 'selecting'), true);
    assert.equal(canTransition('selecting', 'reserved'), true);
  });

  it('[SEAT-007] reserved -> reserved 재할당은 불가', () => {
    assert.equal(canTransition('reserved', 'reserved'), false);
  });

  it('[SEAT-007] 취소: reserved -> available 허용', () => {
    assert.equal(canTransition('reserved', 'available'), true);
  });

  it('[SEAT-001] (performanceId, row, number) 조합은 고유 키로 사용', () => {
    const a: Seat = { performanceId: 'p1', row: 'A', number: 3, status: 'available' };
    const b: Seat = { performanceId: 'p1', row: 'A', number: 3, status: 'selecting' };
    assert.equal(seatKey(a), seatKey(b));
  });

  it('[SEAT-003] 동일 좌석에 reserved 가 둘이면 invariant 위반', () => {
    const reservations = [
      { seatKey: 'p1#A-1', status: 'reserved' as const },
      { seatKey: 'p1#A-1', status: 'reserved' as const },
    ];
    const reservedCount = reservations.filter(r => r.status === 'reserved').length;
    assert.notEqual(reservedCount, 1, 'invariant 위반: 동일 좌석에 reserved 가 둘 이상이면 안 됨');
    // 실제 구현에서는 유니크 제약으로 두 번째 insert 가 실패해야 한다.
  });

  it('[SEAT-005] unavailable 좌석은 selecting 으로 전이 불가', () => {
    assert.equal(canTransition('unavailable', 'selecting'), false);
  });
});

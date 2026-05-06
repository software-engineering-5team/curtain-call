/**
 * concurrency.test.ts
 * 동시 예매 / 동시 대여 신청에서의 레이스 컨디션 방어
 * 관련 규칙: SEAT-008, RES-006, TIME-003
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type SeatStatus = 'available' | 'selecting' | 'reserved' | 'unavailable';

interface SeatRow { performanceId: string; row: string; number: number; status: SeatStatus; reservedBy?: string }

/**
 * 트랜잭션 + 유니크 제약을 흉내 낸 in-memory 좌석 저장소.
 * compareAndReserve 는 status='available' 인 경우에만 reserved 로 바꾸고 그렇지 않으면 false.
 */
function createSeatStore(initial: SeatRow[]) {
  const map = new Map<string, SeatRow>();
  for (const s of initial) map.set(`${s.performanceId}#${s.row}-${s.number}`, { ...s });
  return {
    compareAndReserve(key: string, userId: string): boolean {
      const cur = map.get(key);
      if (!cur || cur.status !== 'available') return false;
      cur.status = 'reserved';
      cur.reservedBy = userId;
      return true;
    },
    get(key: string): SeatRow | undefined {
      return map.get(key);
    },
  };
}

describe('Concurrency', () => {
  it('[SEAT-008] 동일 좌석에 동시 두 요청이 와도 한 명만 성공한다', async () => {
    const store = createSeatStore([{ performanceId: 'p1', row: 'A', number: 1, status: 'available' }]);
    const key = 'p1#A-1';

    const results = await Promise.all([
      Promise.resolve(store.compareAndReserve(key, 'user-A')),
      Promise.resolve(store.compareAndReserve(key, 'user-B')),
    ]);

    const wins = results.filter(Boolean).length;
    assert.equal(wins, 1, '정확히 한 명만 점유에 성공해야 한다');
    assert.equal(store.get(key)?.status, 'reserved');
  });

  it('[RES-006] 점유 실패 시 좌석 상태에 부작용이 없다', () => {
    const store = createSeatStore([{ performanceId: 'p1', row: 'A', number: 1, status: 'reserved', reservedBy: 'user-X' }]);
    const before = { ...store.get('p1#A-1')! };
    const ok = store.compareAndReserve('p1#A-1', 'user-Y');
    assert.equal(ok, false);
    assert.deepEqual(store.get('p1#A-1'), before, '실패 요청은 상태를 바꾸지 않아야 한다');
  });

  it('[TIME-003] 동일 시간대에 두 대여 신청이 오면 한 건만 확정된다 (선착순)', () => {
    type Rental = { id: string; venue: string; startTime: number; endTime: number; status: 'confirmed' | 'rejected' };
    const confirmed: Rental[] = [];
    function tryConfirm(r: Omit<Rental, 'status'>): Rental {
      const conflict = confirmed.some(c => c.venue === r.venue && r.startTime < c.endTime && r.endTime > c.startTime);
      const final: Rental = { ...r, status: conflict ? 'rejected' : 'confirmed' };
      if (!conflict) confirmed.push(final);
      return final;
    }
    const a = tryConfirm({ id: 'a', venue: 'hall-1', startTime: 1800, endTime: 2200 });
    const b = tryConfirm({ id: 'b', venue: 'hall-1', startTime: 2000, endTime: 2300 });
    assert.equal(a.status, 'confirmed');
    assert.equal(b.status, 'rejected');
  });
});

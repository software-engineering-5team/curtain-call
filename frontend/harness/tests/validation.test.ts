/**
 * validation.test.ts
 * 입력값 / 시간 / 인증 형식 검증
 * 관련 규칙: time-rules.json, common-rules.json
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const KOOKMIN_DOMAIN = '@kookmin.ac.kr';

function isKookminEmail(email: string): boolean {
  return /@kookmin\.ac\.kr$/i.test(email.trim());
}

function isValidContact(contact: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(contact);
}

function isOverlap(a: { start: number; end: number }, b: { start: number; end: number }): boolean {
  return a.start < b.end && a.end > b.start;
}

function isValidTimeRange(start: string, end: string): boolean {
  return start < end; // 'HH:mm' 문자열은 사전식 비교가 안전
}

describe('Validation', () => {
  it('[COMMON-001] 국민대학교 이메일만 통과', () => {
    assert.equal(isKookminEmail('hong@kookmin.ac.kr'), true);
    assert.equal(isKookminEmail('hong@gmail.com'), false);
    assert.equal(isKookminEmail('HONG@KOOKMIN.AC.KR'), true);
  });

  it('[COMMON-009] 연락처 형식 검증 010-XXXX-XXXX', () => {
    assert.equal(isValidContact('010-1234-5678'), true);
    assert.equal(isValidContact('01012345678'), false);
    assert.equal(isValidContact('011-1234-5678'), false);
  });

  it('[TIME-001] 시작 < 종료 가 아니면 거부', () => {
    assert.equal(isValidTimeRange('18:00', '22:00'), true);
    assert.equal(isValidTimeRange('22:00', '18:00'), false);
    assert.equal(isValidTimeRange('18:00', '18:00'), false);
  });

  it('[TIME-002] 두 구간이 겹치는 경우 true', () => {
    // 18:00-22:00 vs 17:00-21:00 → overlap
    assert.equal(isOverlap({ start: 1800, end: 2200 }, { start: 1700, end: 2100 }), true);
    // 18:00-22:00 vs 22:00-23:00 → 인접하지만 겹치지 않음
    assert.equal(isOverlap({ start: 1800, end: 2200 }, { start: 2200, end: 2300 }), false);
    // 동일 구간 → 겹침
    assert.equal(isOverlap({ start: 1800, end: 2200 }, { start: 1800, end: 2200 }), true);
  });

  it('[COMMON-010] 예상 인원은 1 이상이며 좌석 수를 초과할 수 없다', () => {
    const totalSeats = 100;
    const validate = (n: number) => n >= 1 && n <= totalSeats;
    assert.equal(validate(0), false);
    assert.equal(validate(1), true);
    assert.equal(validate(100), true);
    assert.equal(validate(101), false);
  });

  it('[TIME-005] 사용 일자는 오늘 이후여야 한다', () => {
    const today = new Date('2026-05-06T00:00:00+09:00');
    const past = new Date('2026-05-05T00:00:00+09:00');
    const future = new Date('2026-05-07T00:00:00+09:00');
    assert.equal(future >= today, true);
    assert.equal(past >= today, false);
  });
});

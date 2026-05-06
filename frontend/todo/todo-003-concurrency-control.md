# todo-003 · 동시성 제어(이중 점유 방지)

- Status: pending
- Owner: TBD
- 관련 규칙: SEAT-008, RES-006, TIME-003

## 작업 목표

동일 좌석에 대한 동시 예매 요청, 동일 시간대에 대한 동시 대여 요청이 와도 데이터 무결성을 깨지 않도록 한다.

## 관련 파일

- 신규: `lib/seat.ts` (compareAndReserve)
- 신규: `app/api/reservations/route.ts`
- 신규: `app/api/rentals/route.ts`
- DB 스키마(있다면): 유니크 인덱스 `(performanceId, row, number) WHERE status='reserved'`

## 완료 조건 (Definition of Done)

- [ ] 좌석 점유는 트랜잭션 안에서 status 비교 → 변경 → 커밋 순으로 수행
- [ ] 동일 좌석 동시 요청 1000회 시뮬레이션에서 정확히 1개만 success
- [ ] 점유 실패 요청은 좌석/잔여석/예매 데이터에 부작용 없음
- [ ] 동일 시간대 두 대여 요청 시 두 번째는 `TIME_CONFLICT`
- [ ] `harness/tests/concurrency.test.ts` 가 green

## 검증 방법

1. `npx tsx --test harness/tests/concurrency.test.ts`
2. k6 또는 단순 Promise.all 부하 테스트 스크립트로 1000회 실행
3. DB(또는 in-memory) 에서 동일 좌석에 reserved 가 1건뿐인지 SQL 로 확인
4. 실패 응답을 받은 클라이언트가 사용자 친화적 메시지로 안내하는지 확인

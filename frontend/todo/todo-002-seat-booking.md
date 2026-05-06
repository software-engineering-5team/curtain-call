# todo-002 · 좌석 예매 흐름 및 좌석 상태 머신

- Status: pending
- Owner: TBD
- 관련 규칙: SEAT-001 ~ SEAT-009, RES-003, RES-004, RES-006

## 작업 목표

좌석 선택 → 임시 점유(`selecting`) → 확정(`reserved`) 흐름을 정확하게 구현한다.
운영자의 좌석 설정(`/seat-config`)에서 비활성화한 좌석은 어떤 경로로도 점유되지 않도록 한다.

## 관련 파일

- `components/seat.tsx`
- `app/performances/[id]/page.tsx`
- `app/seat-config/page.tsx`
- `lib/types.ts`
- 신규: `lib/seat.ts` (상태 전이 함수, 그리드 생성)
- 신규: `components/features/seat/SeatGrid.tsx`
- 신규: `components/features/seat/SeatLegend.tsx`

## 완료 조건 (Definition of Done)

- [ ] 좌석 상태는 `available | selecting | reserved | unavailable` 4가지로 한정
- [ ] 운영자가 비활성화한 좌석은 사용자 화면에서 비활성 + 서버에서 거부
- [ ] 1인당 한도 초과 시 추가 선택 자체가 불가
- [ ] 예매 직전 서버에서 좌석 상태를 재확인하고, 변경됐다면 `SEAT_TAKEN` 반환
- [ ] `harness/tests/seat-booking.test.ts` 가 green

## 검증 방법

1. `npx tsx --test harness/tests/seat-booking.test.ts`
2. 좌석 설정 화면에서 임의 좌석 비활성화 → 예매 화면에서 클릭 불가 확인
3. devtools 로 직접 API 호출 시도 → 서버가 거부하는지 확인
4. PR 리뷰 시 `review-checklist.md` 의 2번(도메인 정합성) 통과

# todo-001 · 예약(대여 + 예매) CRUD 정착

- Status: pending
- Owner: TBD
- 관련 규칙: RES-001, RES-002, RES-005, RES-008, TIME-001, TIME-002, TIME-003, COMMON-005

## 작업 목표

공연장 대여 신청과 좌석 예매의 생성/조회/취소를 **즉시 확정 모델**로 일관되게 구현한다.
현재 `app/rental/page.tsx`, `app/performances/[id]/page.tsx`, `app/mypage/page.tsx` 에 흩어진 로직을 도메인 함수로 분리하고, 서버 액션으로 끌어올린다.

## 관련 파일

- `app/rental/page.tsx` (신청 폼)
- `app/performances/[id]/page.tsx` (좌석 예매)
- `app/mypage/page.tsx` (내역 및 취소)
- `lib/types.ts`
- `lib/mock-data.ts`
- 신규: `lib/reservation.ts` (도메인 함수)
- 신규: `app/api/rentals/route.ts`, `app/api/reservations/route.ts`

## 완료 조건 (Definition of Done)

- [ ] 대여 신청 → 시간 충돌 없으면 `confirmed`, 충돌이면 `TIME_CONFLICT` 코드 반환
- [ ] 좌석 예매 → 좌석 점유 성공 시 `confirmed`, 실패 시 표준 코드 반환
- [ ] 마이페이지 "대여 신청 / 내 공연 / 예매 내역" 3개 탭이 본인 데이터만 보여줌
- [ ] 예매 성공 화면이 공연명/일시/좌석 목록을 모두 표시
- [ ] `harness/tests/reservation.test.ts`, `cancellation.test.ts` 가 모두 green
- [ ] 인증되지 않은 호출은 401 + `AUTH_REQUIRED`

## 검증 방법

1. `npx tsx --test harness/tests/reservation.test.ts harness/tests/cancellation.test.ts`
2. 수동: 동일 시간대 대여 두 번 신청 → 두 번째는 충돌 화면
3. 수동: 1인당 maxSeatsPerPerson 초과 선택 시 버튼 비활성화 + 서버 거부
4. PR 리뷰 시 `harness/prompts/review-checklist.md` 의 1, 2, 3, 5번 섹션 통과

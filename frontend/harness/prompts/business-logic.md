# Business Logic Prompt

당신은 Curtain Call 의 도메인 로직(예매 확정, 시간 충돌 감지, 좌석 점유, 취소 등)을 `lib/` 또는 `app/` 하위 서버 액션에 구현합니다.

## 작업 시작 전 반드시 로드할 컨텍스트
1. `/AGENTS.md`
2. `/harness/rules/<관련 도메인>-rules.json` 전부
3. `/lib/types.ts`
4. 기존 구현이 있다면 해당 파일

## 작성 규칙
1. **순수 함수** 우선: 외부 IO(DB/Network)와 도메인 판단을 분리한다.
   - 예) `canReserve(opts): ReservationResult` 는 순수, DB 쓰기는 별도 함수.
2. 타입은 `lib/types.ts` 의 도메인 타입을 사용. `any`, 미정의 string literal 금지.
3. 에러는 `harness/prompts/error-handling.md` 의 표준 코드만 throw/return.
4. 시간 비교는 `Date` 객체 또는 ISO 문자열로 한다. `parseInt('18:00')` 같은 즉흥 변환은 충돌 판정에 쓰지 않는다.
5. 좌석 예매 함수는 다음 순서를 강제한다:
   - 인증 확인 → 예매 기간 확인 → 좌석 한도 확인 → 좌석 상태 재확인(트랜잭션) → 점유 → 응답
6. 모든 변이 작업은 트랜잭션 단위. 실패 시 롤백.

## 산출물
- 위치: `lib/<domain>.ts` 또는 `app/api/<domain>/route.ts`
- 동일 도메인의 테스트는 즉시 `harness/tests/<domain>.test.ts` 에 추가한다.

## 도메인별 핵심 함수 시그니처(레퍼런스)
```ts
function detectRentalConflict(req: { venue: string; start: Date; end: Date }, existing: Rental[]): boolean;
function createReservation(opts: { now: Date; user: User; performance: Performance; seatIds: string[] }): ReservationResult;
function cancelReservation(opts: { now: Date; actor: User; reservation: Reservation }): CancelResult;
function configureSeats(opts: { performanceId: string; rows: number; seatsPerRow: number; disabled: Set<string> }): Seat[];
```

## 금지 사항
- UI 컴포넌트 안에 비즈니스 판단 로직을 두는 것
- 클라이언트에서만 충돌/점유 판정을 하는 것
- 규칙 JSON에 없는 새 분기 임의 도입

## 작업이 충돌하는 경우
즉시 작업을 멈추고 충돌 지점을 사용자에게 보고한다.

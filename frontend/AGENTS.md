# AGENTS.md

> 국민대학교 복지관 공연장 대여 및 좌석 예매 서비스(Curtain Call)의 전역 운영 규칙(Service-wide Rules)을 정의한다.
> 모든 AI 에이전트(Claude, Codex 등)와 컨트리뷰터는 이 문서를 **단일 진실의 원천(Single Source of Truth)** 으로 따른다.

---

## 1. 서비스 개요

- **서비스명**: Curtain Call
- **운영 주체**: 국민대학교 복지관
- **핵심 도메인**
  - 공연장 대여 신청(Venue Rental)
  - 공연 등록 및 좌석 배치 설정(Performance & Seat Configuration)
  - 좌석 예매(Seat Reservation)
  - 마이페이지(My Activity)
- **주요 사용자**: 국민대학교 재학생, 동아리, 공연 운영자

---

## 2. 인증 (Authentication)

- 모든 사용자 인증은 **국민대학교 구글 계정(@kookmin.ac.kr)** 으로만 수행한다.
- 외부(타 도메인) 구글 계정은 로그인 자체가 거부되어야 한다.
- 학번(`studentId`)은 로그인 시 학교 인증 정보로부터 자동 매핑하며, 사용자가 임의로 수정할 수 없다.
- 비로그인 상태에서는 다음 행위가 금지된다.
  - 공연장 대여 신청
  - 좌석 예매
  - 좌석 설정
  - 마이페이지 접근
- 토큰/세션이 만료되면 즉시 로그인 페이지로 리다이렉트한다.

---

## 3. 예약 확정 방식 (Reservation Confirmation)

- 모든 대여 신청과 좌석 예매는 **즉시 확정(Instant Confirmation)** 방식이다.
- 별도 운영자 승인 단계는 두지 않는다.
- 확정과 동시에 다음 상태가 보장되어야 한다.
  - 대여: `VenueRental.status = 'confirmed'`
  - 예매: `Reservation.status = 'confirmed'`
- 확정 직후 사용자에게 성공 페이지/알림으로 결과를 명확히 전달한다.

---

## 4. 시간 중복 금지 (No Time Overlap)

- 동일 공연장에 대해 **시간이 1분이라도 겹치는** 대여 신청은 모두 거부한다.
- 비교 규칙: 두 구간 `[A.start, A.end)`, `[B.start, B.end)` 가 `A.start < B.end && A.end > B.start` 이면 충돌로 간주한다.
- 시간 단위는 분(minute) 이상으로 정의하고, 시작 < 종료 를 강제한다.
- 충돌 발생 시 사용자에게 충돌 사유와 충돌 구간을 표시한다.

---

## 5. 좌석 중복 예매 방지 (No Double Booking)

- 동일 `(performanceId, row, number)` 좌석은 **단 한 명만** 예매할 수 있다.
- 좌석 상태 머신은 다음 4개로 제한한다.
  - `available` → 예매 가능
  - `selecting` → 사용자가 선택 중(임시 점유)
  - `reserved` → 예매 확정
  - `unavailable` → 사용 불가(운영자가 비활성화)
- 동시 클릭/동시 요청에 대비하여 서버 측에서 **트랜잭션 + 유니크 제약**으로 이중 점유를 방지한다.
- 예매 확정 직전 좌석 상태가 `available`이 아니라면 즉시 실패 처리한다.
- 1인당 최대 예매 좌석은 `Performance.maxSeatsPerPerson`을 따른다.

---

## 6. 예매 기간 (Booking Window)

- 예매는 `Performance.bookingStartDate <= now <= Performance.bookingEndDate` 인 경우에만 허용한다.
- 그 외 시간대에는 좌석 선택 UI를 비활성화한다.
- 공연 시작 시각 이후의 좌석 예매는 무조건 거부한다.

---

## 7. 예매 성공 / 실패 처리 (Success / Failure Handling)

### 성공
- 사용자에게 다음 정보를 함께 표시한다: 공연명, 공연 일시, 예매 좌석, 좌석 수.
- 마이페이지(`/mypage`)의 "예매 내역" 탭에서 즉시 확인 가능해야 한다.
- 성공 화면에서 "마이페이지 / 목록으로" 두 가지 액션을 제공한다.

### 실패
실패 사유는 사용자에게 **명확한 한국어 메시지**로 전달한다.

| 코드 | 사유 | 사용자 메시지 |
|---|---|---|
| `AUTH_REQUIRED` | 미로그인 | "로그인 후 이용해 주세요." |
| `NOT_KOOKMIN_ACCOUNT` | 비국민대 계정 | "국민대학교 구글 계정으로만 이용 가능합니다." |
| `TIME_CONFLICT` | 대여 시간 충돌 | "해당 시간에는 이미 예약된 일정이 있습니다." |
| `SEAT_TAKEN` | 좌석 이미 점유 | "선택하신 좌석은 이미 예매되었습니다. 새로고침 후 다시 시도해 주세요." |
| `OUT_OF_BOOKING_WINDOW` | 예매 기간 외 | "현재는 예매 기간이 아닙니다." |
| `MAX_SEATS_EXCEEDED` | 1인당 한도 초과 | "1인당 최대 N석까지만 예매할 수 있습니다." |
| `VALIDATION_ERROR` | 필수값 누락/형식 오류 | "입력값을 확인해 주세요." |

- 실패는 **부작용 없음(no side effect)** 을 보장한다. 실패 시 좌석/대여 상태는 변경되지 않는다.
- 실패 화면에서 사용자에게 재시도 또는 다른 선택을 유도하는 액션을 제공한다.

---

## 8. 취소 (Cancellation)

- 본인 소유의 대여/예매만 취소할 수 있다.
- 취소 시 상태는 `cancelled`로 변경되며 **레코드는 삭제하지 않는다(soft cancel).**
- 좌석 예매 취소 시 해당 좌석은 즉시 `available`로 복귀한다.
- 공연 시작 시각 이후 / 사용 일자 경과 후의 취소는 거부한다.
- 취소는 되돌릴 수 없으며, 사용자에게 사전에 명확히 경고한다.

---

## 9. 데이터 모델 불변 규칙 (Invariants)

다음 항목은 절대 깨져선 안 된다.

- `User.email` 도메인은 `@kookmin.ac.kr` 이다.
- `VenueRental.startTime < VenueRental.endTime`
- `Performance.bookingStartDate <= Performance.bookingEndDate`
- `Performance.availableSeats >= 0` 이고 `<= Performance.totalSeats`
- 동일 `(performanceId, row, number)`를 갖는 `Seat`는 시스템 전체에 1개만 존재한다.
- 동일 좌석에 대해 `status='reserved'`인 활성 `Reservation`은 1건 이하이다.

---

## 10. 공통 규칙 (Common Rules for All Agents)

1. **타입 안정성**: 모든 도메인 객체는 `lib/types.ts` 의 타입을 따른다. `any` 사용 금지.
2. **국민대 컨텍스트 유지**: 사용자에게 노출되는 모든 문구는 한국어이며 학교 맥락을 깨지 않는다.
3. **시간 처리**: 클라이언트와 서버는 항상 ISO 8601(UTC 저장 / KST 표시)을 사용한다.
4. **상태 변경의 원자성**: 예매/대여/취소는 트랜잭션 단위로 처리한다.
5. **테스트 필수**: 4~8장의 규칙을 변경하는 모든 PR은 `harness/tests/` 에 케이스를 추가/수정한다.
6. **하네스 우선**: AI는 코드를 작성하기 전에 반드시 `harness/rules/*.json` 과 해당 폴더의 `CLAUDE.md` 를 먼저 읽는다.
7. **TODO 동기화**: 새로운 작업은 `todo/todo-XXX-작업명.md` 형식으로 추가한다.
8. **로그/감사**: 예매·취소·인증 실패는 서버 로그에 사용자 ID, 좌석/대여 ID, 사유 코드를 남긴다.

---

## 11. 디렉토리 구조 (요약)

```
project-root/
├── AGENTS.md              ← 본 문서
├── harness/
│   ├── CLAUDE.md
│   ├── rules/             ← 정책 JSON
│   ├── tests/             ← 비즈니스 로직 테스트
│   └── prompts/           ← AI 작업용 프롬프트
├── todo/                  ← 작업 단위 TODO 문서
└── src (app/, components/, lib/, hooks/)
```

상세 규칙은 각 폴더의 `CLAUDE.md` 와 `harness/rules/*.json` 을 참고한다.

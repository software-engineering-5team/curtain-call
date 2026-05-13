# AGENTS.md

> 국민대학교 복지관 공연장 대여 및 좌석 예매 서비스(Curtain Call)의 전역 운영 규칙(Service-wide Rules)을 정의한다.
> 모든 AI 에이전트(Claude, Codex 등)와 백엔드 컨트리뷰터는 이 문서를 **단일 진실의 원천(Single Source of Truth)** 으로 따른다.

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
- 외부(타 도메인) 구글 계정의 로그인(토큰 발급/세션 생성) 요청은 거부한다 (403 Forbidden).
- 학번(`studentId`)은 로그인 시 학교 인증 정보로부터 자동 매핑하며, 클라이언트가 임의로 수정할 수 없도록 강제한다.
- 인증 정보가 없거나 유효하지 않은 경우 다음 API 접근을 금지한다 (401 Unauthorized).
  - 공연장 대여 신청
  - 좌석 예매
  - 좌석 설정
  - 마이페이지 정보 조회
- 인증 토큰 만료 시 프론트엔드가 이를 인지하고 리다이렉트할 수 있도록 적절한 에러를 반환한다.

---

## 3. 예약 확정 방식 (Reservation Confirmation)

- 모든 대여 신청과 좌석 예매는 **즉시 확정(Instant Confirmation)** 방식이다.
- 별도의 관리자 승인 단계를 거치지 않는다.
- 데이터베이스 트랜잭션 커밋과 동시에 다음 상태가 반영되어야 한다.
  - 대여: `VenueRental.status = 'confirmed'`
  - 예매: `Reservation.status = 'confirmed'`
- 처리가 성공하면 클라이언트에게 명확한 성공 응답(예: 201 Created)을 전달한다.

---

## 4. 시간 중복 금지 (No Time Overlap)

- 동일 공연장에 대해 **시간이 1분이라도 겹치는** 대여 신청은 모두 거부한다.
- 비교 규칙: 두 구간 `[A.start, A.end)`, `[B.start, B.end)` 가 `A.start < B.end && A.end > B.start` 이면 충돌로 간주한다.
- 시간 단위는 분(minute) 이상으로 정의하고, `start < end` 제약조건을 비즈니스 로직과 데이터베이스 수준에서 강제한다.
- 충돌 발생 시 409 Conflict 와 함께 충돌 사유를 응답한다.

---

## 5. 좌석 중복 예매 방지 (No Double Booking)

- 동일 `(performanceId, row, number)` 좌석은 **단 한 명만** 예매할 수 있다.
- 좌석 상태 머신은 다음 4개로 제한한다.
  - `available` → 예매 가능
  - `selecting` → 사용자가 선택 중(임시 점유 - Redis 등 활용 권장)
  - `reserved` → 예매 확정
  - `unavailable` → 사용 불가(운영자가 비활성화)
- 동시 요청(Concurrency)에 대비하여 **비관적 락(Pessimistic Lock), 낙관적 락(Optimistic Lock)** 또는 **유니크 제약(Unique Constraint)** 을 활용하여 이중 점유를 철저히 방지한다.
- 예매 확정 요청 처리 시점의 좌석 상태가 `available`(또는 본인의 `selecting`)이 아니라면 즉시 예외를 발생시키고 트랜잭션을 롤백한다.
- 1인당 최대 예매 좌석 수는 `Performance.maxSeatsPerPerson` 값을 초과할 수 없다.

---

## 6. 예매 기간 (Booking Window)

- 예매 관련 API 요청은 서버 시간 기준 `Performance.bookingStartDate <= now <= Performance.bookingEndDate` 인 경우에만 허용한다.
- 해당 시간 외의 요청은 거부한다 (403 Forbidden 또는 400 Bad Request).
- 공연 시작 시각 이후의 좌석 예매 요청은 무조건 거부한다.

---

## 7. 예매 성공 / 실패 처리 (Success / Failure Handling)

### 성공
- 트랜잭션 커밋 완료 후, 예매/대여 정보를 프론트엔드가 렌더링할 수 있도록 응답 본문에 포함한다.
- 200 OK 또는 201 Created 반환.

### 실패
- 예외 발생 시 전역 예외 처리기(Global Exception Handler)를 통해 정형화된 에러 응답을 반환한다.
- 프론트엔드와 합의된 일관된 에러 코드를 사용한다.

| 코드 | 사유 | HTTP 상태 |
|---|---|---|
| `AUTH_REQUIRED` | 미로그인/토큰 만료 | 401 |
| `NOT_KOOKMIN_ACCOUNT` | 비국민대 계정 | 403 |
| `TIME_CONFLICT` | 대여 시간 충돌 | 409 |
| `SEAT_TAKEN` | 좌석 이미 점유됨 | 409 |
| `OUT_OF_BOOKING_WINDOW` | 예매 기간 외 요청 | 403 / 400 |
| `MAX_SEATS_EXCEEDED` | 1인당 한도 초과 | 400 |
| `VALIDATION_ERROR` | 필수값 누락/형식 오류 | 400 |

- 실패는 시스템에 **부작용(Side Effect)이 없음**을 보장해야 하며, 진행 중이던 트랜잭션은 롤백되어야 한다.

---

## 8. 취소 (Cancellation)

- API 요청자의 정보와 예매/대여의 소유자가 일치할 때만 취소를 허용한다.
- 데이터 삭제(`DELETE`)가 아닌, 상태를 `cancelled`로 변경하는 **소프트 캔슬(Soft Cancel)** 방식을 사용한다.
- 예매 취소 즉시 해당 좌석의 상태는 `available`로 복귀해야 한다.
- 공연 시작 시각 이후, 혹은 사용 일자 경과 후의 취소 요청은 거부한다.

---

## 9. 데이터 모델 불변 규칙 (Invariants)

다음 제약조건은 데이터 무결성을 위해 비즈니스 로직은 물론 가급적 DB 수준에서도 보호되어야 한다.

- `User.email` 도메인은 항상 `@kookmin.ac.kr` 이다.
- `VenueRental.startTime < VenueRental.endTime`
- `Performance.bookingStartDate <= Performance.bookingEndDate`
- `Performance.availableSeats >= 0` AND `<= Performance.totalSeats`
- 동일 `(performanceId, row, number)`를 갖는 `Seat` 레코드는 단 1개만 존재한다 (Unique Constraint).
- 동일 좌석에 대해 `status='reserved'`인 활성 `Reservation` 레코드는 1건 이하이다.

---

## 10. 공통 규칙 (Common Rules for All Agents)

1. **타입 안정성**: 모든 도메인/엔티티/DTO는 명확한 타입(클래스/인터페이스 등)을 사용하여 정의한다.
2. **RESTful API**: 리소스 중심의 일관된 URI 설계 및 적절한 HTTP 메서드(`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)를 사용한다.
3. **시간 처리**: DB 저장 및 클라이언트와의 통신(JSON)은 항상 ISO 8601 (UTC) 기준을 사용한다.
4. **상태 변경의 원자성**: 상태 변경을 수반하는 API 로직은 반드시 하나의 트랜잭션 단위로 처리하여 데이터의 정합성을 보장한다.
5. **테스트 필수**: 4~8장의 규칙(특히 동시성 제어)을 구현/변경하는 모든 코드는 적절한 단위 테스트 및 통합 테스트를 포함해야 한다.
6. **TODO 동기화**: 새로운 작업은 프론트엔드와 동일하게 `todo/todo-XXX-작업명.md` 형식으로 관리한다.
7. **로그/감사**: 예매·취소·인증 실패 등 주요 비즈니스/보안 이벤트는 서버 로그에 사용자 ID, 관련 리소스 ID, 사유 코드를 명시하여 추적 가능하게 남긴다.

---

## 11. 디렉토리 구조 (요약)

```
project-root/ (backend)
├── AGENTS.md              ← 본 문서
├── todo/                  ← 작업 단위 TODO 문서
└── src/                   ← (추후 백엔드 프레임워크 스택 확정 후 구체화 예정)
```
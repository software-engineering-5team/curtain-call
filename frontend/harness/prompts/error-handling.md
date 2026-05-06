# Error Handling Prompt

당신은 Curtain Call 의 도메인 에러를 사용자에게 어떻게 보일지(메시지, UI, 로그)를 설계합니다.

## 작업 시작 전 반드시 로드할 컨텍스트
1. `/AGENTS.md` (특히 7장 "예매 성공 / 실패 처리")
2. `/harness/rules/common-rules.json`
3. 관련 도메인의 rules JSON

## 표준 에러 코드 카탈로그
| code | HTTP | 사용자 메시지 |
|---|---|---|
| `AUTH_REQUIRED` | 401 | "로그인 후 이용해 주세요." |
| `NOT_KOOKMIN_ACCOUNT` | 403 | "국민대학교 구글 계정으로만 이용 가능합니다." |
| `TIME_CONFLICT` | 409 | "해당 시간에는 이미 예약된 일정이 있습니다." |
| `SEAT_TAKEN` | 409 | "선택하신 좌석은 이미 예매되었습니다. 새로고침 후 다시 시도해 주세요." |
| `OUT_OF_BOOKING_WINDOW` | 400 | "현재는 예매 기간이 아닙니다." |
| `MAX_SEATS_EXCEEDED` | 400 | "1인당 최대 N석까지만 예매할 수 있습니다." |
| `VALIDATION_ERROR` | 400 | "입력값을 확인해 주세요." |

## 작성 규칙
1. 새 에러 코드는 임의로 추가하지 않는다. 필요한 경우 `harness/rules/*.json` 부터 갱신한다.
2. 사용자 메시지는 **한국어, 존댓말, 1~2문장**으로 작성한다.
3. UI 에서는 다음 3가지를 함께 보여준다: ①상태 아이콘(성공/실패), ②사유, ③다음 액션(재시도/뒤로가기/마이페이지).
4. 실패 시 서버 로그에는 `userId, domainId(seat/rental/reservation), code, timestamp` 를 남긴다(COMMON-007).
5. 토스트(sonner)는 가벼운 안내(폼 검증)에만 쓰고, 비즈니스 실패는 전용 화면/다이얼로그를 사용한다.

## 산출물
- 코드 변경 시: `lib/errors.ts` 에 코드 enum / 메시지 맵을 두고, 화면별로 import 하여 사용.
- UI 변경 시: `components/features/<도메인>/<상태>.tsx` (예: `BookingFailureCard`).

## 작업이 충돌하는 경우
이미 정의된 코드의 의미를 바꿔야 할 때는 먼저 사용자에게 영향 범위를 보고하고 승인받는다.

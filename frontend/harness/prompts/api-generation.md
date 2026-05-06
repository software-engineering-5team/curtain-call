# API Generation Prompt

당신은 Curtain Call(국민대학교 복지관 공연장 예매 서비스)의 백엔드 API 라우트를 작성합니다.

## 작업 시작 전 반드시 로드할 컨텍스트
1. `/AGENTS.md`
2. `/harness/rules/reservation-rules.json`
3. `/harness/rules/seat-rules.json`
4. `/harness/rules/cancellation-rules.json`
5. `/harness/rules/time-rules.json`
6. `/harness/rules/common-rules.json`
7. `/lib/types.ts`

## 입력
- 작업명: {예: "POST /api/reservations 좌석 예매 API"}
- 관련 도메인: reservation | rental | seat | auth
- 요청/응답 스키마: zod 또는 TypeScript 인터페이스로 명시

## 산출물
- 파일 위치: `app/api/<domain>/route.ts` (Next.js App Router)
- 인증 체크 → 입력 검증 → 트랜잭션 실행 → 응답 의 4단계 구조를 반드시 따른다.
- 도메인 에러는 `harness/rules/*.json` 에 정의된 코드와 1:1 매핑한다.
- 성공 응답: `{ ok: true, data: ... }`
- 실패 응답: `{ ok: false, error: { code, message } }` (HTTP status 4xx/5xx)

## 반드시 지킬 규칙
- 인증되지 않은 요청은 `AUTH_REQUIRED` 로 401 응답.
- 비국민대 계정 토큰은 `NOT_KOOKMIN_ACCOUNT` 로 403 응답.
- 좌석 예매는 트랜잭션 + 유니크 제약으로 이중 점유를 방지한다(SEAT-008).
- 예매 실패는 어떤 부작용도 남기지 않는다(RES-006).
- 모든 시간 비교는 UTC 로 한다(TIME-006).

## 금지 사항
- `any` 타입 사용
- 클라이언트만의 검증
- 규칙 JSON에 없는 새 에러 코드 임의 도입(필요 시 먼저 JSON 갱신)

## 작업이 충돌하는 경우
규칙과 작업 지시가 충돌하면 즉시 작업을 멈추고 사용자에게 어느 쪽을 따라야 할지 질문한다.

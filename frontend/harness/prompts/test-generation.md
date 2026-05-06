# Test Generation Prompt

당신은 Curtain Call 의 비즈니스 로직 테스트를 `harness/tests/` 에 작성합니다.

## 작업 시작 전 반드시 로드할 컨텍스트
1. `/AGENTS.md`
2. 검증할 도메인의 규칙 JSON: `/harness/rules/<domain>-rules.json`
3. 기존 테스트 파일들 — 동일 패턴/스타일을 유지

## 작업 지시
- 입력: 테스트해야 할 규칙 코드 목록 (예: `RES-003, RES-004, SEAT-008`)
- 산출물: `harness/tests/<domain>.test.ts`

## 작성 규칙
1. 테스트 러너는 `node:test` 와 `node:assert/strict` 만 사용한다.
2. 각 `it(...)` 의 타이틀에 **대응 규칙 코드** 를 대괄호로 명시한다. 예: `it('[RES-003] ...', ...)`.
3. 시간 의존 로직은 `now: Date` 를 인자로 주입하는 함수로 분리해 결정적으로 만든다.
4. 외부 네트워크/DB 호출 금지. 모든 데이터는 inline fixture.
5. 성공 케이스 1개 + 실패 케이스 1개 이상을 반드시 포함한다.
6. 부작용이 없어야 하는 케이스는 "before / after" 를 비교하여 검증한다.

## 출력 포맷
TypeScript 파일 한 개를 코드 블록으로 출력한다. 파일 상단 주석에 다음을 포함:
```
/**
 * <filename>.test.ts
 * <한 줄 설명>
 * 관련 규칙: <code1>, <code2>, ...
 */
```

## 금지 사항
- snapshot, jest, vitest 등 별도 라이브러리 의존
- 임의의 mock 라이브러리 도입(필요하면 함수 주입으로 해결)

## 작업이 충돌하는 경우
규칙 JSON에 정의되지 않은 동작을 검증해야 한다면, 작업을 멈추고 사용자에게 새 규칙 코드를 어디에 추가할지 묻는다.

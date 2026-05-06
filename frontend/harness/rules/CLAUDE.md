# 폴더 역할

서비스의 **도메인 제약 조건(Domain Constraints)** 을 기계가 읽을 수 있는 JSON으로 정의한다.
AI가 비즈니스 로직을 구현하거나 검토할 때 참조하는 정책 카탈로그이며, `harness/tests/` 의 테스트 케이스는 이 JSON을 근거로 작성된다.

# 포함 파일

- `reservation-rules.json` — 좌석 예매 도메인 규칙
- `seat-rules.json` — 좌석 배치/상태 머신 규칙
- `cancellation-rules.json` — 대여/예매 취소 규칙
- `time-rules.json` — 시간 표현, 시간 충돌 판정 규칙
- `common-rules.json` — 인증, 입력 검증 등 전 도메인 공통 규칙

각 파일은 다음 최소 스키마를 따른다.
```json
{
  "id": "reservation",
  "version": 1,
  "rules": [
    { "code": "RES-001", "description": "...", "severity": "error|warn", "appliesTo": ["..."] }
  ]
}
```

# 작업 규칙

1. 규칙은 **선언적**으로 작성한다. "어떻게"가 아니라 "무엇이 참이어야 하는가"만 적는다.
2. 모든 규칙은 고유한 `code`(예: `RES-001`)를 가진다. 한 번 부여한 코드는 재사용/재할당하지 않는다.
3. 규칙을 수정할 때는 `version` 을 1 증가시킨다.
4. 규칙은 `AGENTS.md` 와 항상 일치해야 한다. 충돌이 발생하면 `AGENTS.md` 가 우선이며 JSON을 수정한다.
5. 새 규칙 추가 시 `harness/tests/` 에 대응 케이스를 동일 PR로 추가한다.

# 관련 폴더

- `/AGENTS.md` — 규칙의 상위 출처
- `/harness/tests/` — 본 규칙을 검증하는 테스트
- `/harness/prompts/business-logic.md` — 본 규칙을 코드로 옮길 때 쓰는 프롬프트

# 완료 체크리스트

- [ ] 5개 JSON 파일이 모두 존재한다.
- [ ] 모든 `code` 가 유일하다.
- [ ] AGENTS.md 의 4~8장 규칙이 빠짐없이 반영되었다.
- [ ] 변경된 규칙은 대응 테스트 케이스가 갱신되었다.
- [ ] JSON 이 유효하다(`jq . *.json` 통과).

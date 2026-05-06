# 폴더 역할

AI가 한 번에 처리할 수 있는 **단일 작업 단위(Atomic Task)** 를 Markdown 문서로 관리한다.
한 파일은 한 작업이며, 작업이 시작되면 PR/커밋과 1:1 로 매핑된다.

# 포함 파일

- `todo-001-reservation-crud.md`
- `todo-002-seat-booking.md`
- `todo-003-concurrency-control.md`
- `todo-004-notification.md`
- 추가 작업은 `todo-XXX-작업명.md` 형식으로 늘려 간다.

각 TODO 파일은 다음 섹션을 반드시 포함한다.
1. **작업 목표(Goal)**
2. **관련 파일(Related Files)**
3. **완료 조건(Definition of Done)**
4. **검증 방법(Verification)**

# 작업 규칙

1. 파일명은 `todo-NNN-작업명.md` (NNN = 3자리 숫자, 작업명은 kebab-case).
2. 한 파일은 한 작업만 담는다. 작업이 너무 크면 분리한다.
3. 작업 진행 상태는 파일 상단에 `Status: pending | in-progress | done | blocked` 로 표기한다.
4. 작업이 완료되면 파일을 삭제하지 말고 `Status: done` 으로 두고 git 커밋 SHA를 함께 기록한다.
5. 작업은 반드시 `harness/rules/*.json` 의 코드(RES-xxx 등)를 참조한다.

# 관련 폴더

- `/AGENTS.md` — 작업이 위반해선 안 되는 정책
- `/harness/rules/` — 작업의 근거가 되는 규칙
- `/harness/tests/` — 작업 결과를 검증하는 테스트
- `/harness/prompts/` — 작업 수행에 사용할 프롬프트

# 완료 체크리스트

- [ ] 작업 단위가 한 파일에 들어갈 만큼 작은가
- [ ] 4개 섹션(목표/관련 파일/완료 조건/검증)이 모두 채워졌는가
- [ ] 관련 규칙 코드가 명시되었는가
- [ ] 완료 조건이 객관적으로 측정 가능한가(테스트 통과 등)
- [ ] PR 머지 후 Status 가 `done` 으로 갱신되었는가

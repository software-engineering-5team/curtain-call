# todo-004 · 예매/대여 알림(이메일 + 인앱)

- Status: pending
- Owner: TBD
- 관련 규칙: RES-005, COMMON-006, COMMON-007

## 작업 목표

예매 확정, 대여 확정, 취소 시 사용자에게 이메일과 인앱 알림(토스트 + 마이페이지 배지)을 발송한다.
국민대 메일(@kookmin.ac.kr) 로 발송하며, 학교 톤의 한국어 템플릿을 사용한다.

## 관련 파일

- 신규: `lib/notifications.ts`
- 신규: `lib/email-templates/booking-confirmed.ts`
- 신규: `lib/email-templates/rental-confirmed.ts`
- 신규: `lib/email-templates/cancellation.ts`
- 신규: `components/features/notifications/InboxBadge.tsx`
- `app/mypage/page.tsx` 에 알림 인박스 섹션 추가

## 완료 조건 (Definition of Done)

- [ ] 예매 성공 직후 이메일 1건 발송(공연명/일시/좌석/예매번호 포함)
- [ ] 대여 확정 직후 이메일 1건 발송(행사명/일시/장소 포함)
- [ ] 취소 시 이메일 1건 발송(취소된 항목 정보 + 되돌릴 수 없음 안내)
- [ ] 메일 발송 실패는 비즈니스 결과(예매 자체)에 영향을 주지 않음(비동기, retry)
- [ ] 인앱 알림은 마이페이지 인박스 배지에서 즉시 보임
- [ ] 사용자 메시지가 한국어, 존댓말 일관

## 검증 방법

1. 개발 SMTP(MailHog 등)에서 메일 도착 확인
2. 메일 본문이 학교 공식 톤이며 필수 정보가 모두 포함되는지 시각 검토
3. 발송 실패 케이스 의도적으로 발생시켜 예매 자체는 성공하는지 확인
4. PR 리뷰 시 `review-checklist.md` 의 5, 6번 통과

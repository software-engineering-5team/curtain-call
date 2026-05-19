/**
 * 도메인 에러 코드 카탈로그 및 한국어 메시지 맵
 * harness/rules/*.json + harness/prompts/error-handling.md 기준
 */

export type DomainErrorCode =
  | 'AUTH_REQUIRED'
  | 'NOT_KOOKMIN_ACCOUNT'
  | 'TIME_CONFLICT'
  | 'SEAT_TAKEN'
  | 'OUT_OF_BOOKING_WINDOW'
  | 'MAX_SEATS_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'NOT_OWNER'
  | 'PAST_EVENT'
  | 'ALREADY_CANCELLED';

export const ERROR_MESSAGES: Record<DomainErrorCode, string> = {
  AUTH_REQUIRED: '로그인 후 이용해 주세요.',
  NOT_KOOKMIN_ACCOUNT: '국민대학교 구글 계정(@kookmin.ac.kr)으로만 이용 가능합니다.',
  TIME_CONFLICT: '해당 시간에는 이미 예약된 일정이 있습니다.',
  SEAT_TAKEN: '선택하신 좌석은 이미 예매되었습니다. 새로고침 후 다시 시도해 주세요.',
  OUT_OF_BOOKING_WINDOW: '현재는 예매 기간이 아닙니다.',
  MAX_SEATS_EXCEEDED: '1인당 최대 예매 가능 좌석 수를 초과했습니다.',
  VALIDATION_ERROR: '입력값을 확인해 주세요.',
  NOT_OWNER: '본인의 예약/예매만 취소할 수 있습니다.',
  PAST_EVENT: '이미 종료된 일정은 취소할 수 없습니다.',
  ALREADY_CANCELLED: '이미 취소된 항목입니다.',
};

export function parseErrorCode(raw: string): DomainErrorCode | null {
  const knownCodes = Object.keys(ERROR_MESSAGES) as DomainErrorCode[];
  for (const code of knownCodes) {
    if (raw.includes(code)) return code;
  }
  return null;
}

export function getErrorMessage(raw: string): string {
  const code = parseErrorCode(raw);
  if (code) return ERROR_MESSAGES[code];
  return raw || '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
}

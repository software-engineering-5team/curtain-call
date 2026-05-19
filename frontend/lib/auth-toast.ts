'use client';

import { toast } from '@/hooks/use-toast';

export const AUTH_REQUIRED_TOAST_KEY = 'curtain_call_auth_required_toast';

export function showAuthRequiredToast() {
  toast({
    description: '로그인 이후 사용 가능합니다.',
  });
}

export function queueAuthRequiredToast() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(AUTH_REQUIRED_TOAST_KEY, '1');
}

export function consumeQueuedAuthRequiredToast() {
  if (typeof window === 'undefined') return;
  if (window.sessionStorage.getItem(AUTH_REQUIRED_TOAST_KEY) !== '1') return;
  window.sessionStorage.removeItem(AUTH_REQUIRED_TOAST_KEY);
  showAuthRequiredToast();
}

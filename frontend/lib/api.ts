import type {
  PagePerformanceResponse,
  PerformanceResponse,
  PerformanceCreateRequest,
  PerformanceUpdateRequest,
  SeatStatusResponse,
  SeatCreateRequest,
  SeatUpdateRequest,
  SeatTemplateResponse,
  RentalResponse,
  RentalCreateRequest,
  RentalCheckRequest,
  RentalCheckResponse,
  BookingResponse,
  BookingCreateRequest,
  BookingHoldRequest,
  BookingHoldResponse,
  PerformanceBookingStatusResponse,
  LoginRequest,
  LoginResponse,
  UserDto,
  PosterUploadResponse,
} from './api-types';

export const BASE_URL = 'http://ec2-15-165-44-107.ap-northeast-2.compute.amazonaws.com:8080';
export const AUTH_REQUIRED_EVENT = 'curtain-call:auth-required';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
}

export function removeToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem('access_token');
}

function notifyAuthRequired(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem('curtain_call_auth_required_toast', '1');
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    // COMMON-004: 401 수신 시 토큰 제거 후 홈으로 리다이렉트
    if (res.status === 401) {
      removeToken();
      notifyAuthRequired();
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const authApi = {
  login: (body: LoginRequest) =>
    request<LoginResponse>('/api/auth/google/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  me: () => request<UserDto>('/api/auth/me'),
};

export const performancesApi = {
  list: (page = 0, size = 20) =>
    request<PagePerformanceResponse>(`/api/performances?page=${page}&size=${size}`),
  get: (id: number) => request<PerformanceResponse>(`/api/performances/${id}`),
  create: (body: PerformanceCreateRequest) =>
    request<PerformanceResponse>('/api/performances', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: number, body: PerformanceUpdateRequest) =>
    request<PerformanceResponse>(`/api/performances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  me: () => request<PerformanceResponse[]>('/api/performances/me'),
  uploadPoster: (file: File): Promise<PosterUploadResponse> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URL}/api/performances/upload-poster`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async r => {
      if (r.status === 401) {
        removeToken();
        notifyAuthRequired();
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      if (!r.ok) {
        const text = await r.text().catch(() => '');
        throw new Error(text || `HTTP ${r.status}`);
      }
      return r.json() as Promise<PosterUploadResponse>;
    });
  },
  getBookingStatus: (id: number) =>
    request<PerformanceBookingStatusResponse>(`/api/performances/${id}/bookings`),
};

export const seatsApi = {
  list: (performanceId: number) =>
    request<SeatStatusResponse[]>(`/api/performances/${performanceId}/seats`),
  create: (performanceId: number, body: SeatCreateRequest) =>
    request<void>(`/api/performances/${performanceId}/seats`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (performanceId: number, body: SeatUpdateRequest) =>
    request<void>(`/api/performances/${performanceId}/seats`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  templates: () => request<SeatTemplateResponse[]>('/api/seat-templates'),
};

export const rentalsApi = {
  list: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const qs = params.toString();
    return request<RentalResponse[]>(`/api/rentals${qs ? '?' + qs : ''}`);
  },
  get: (id: number) => request<RentalResponse>(`/api/rentals/${id}`),
  me: () => request<RentalResponse[]>('/api/rentals/me'),
  create: (body: RentalCreateRequest) =>
    request<RentalResponse>('/api/rentals', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id: number) =>
    request<RentalResponse>(`/api/rentals/${id}/cancel`, { method: 'PATCH' }),
  check: (params: RentalCheckRequest) => {
    const qs = new URLSearchParams({
      useDate: params.useDate,
      startTime: params.startTime,
      endTime: params.endTime,
    });
    return request<RentalCheckResponse>(`/api/rentals/check?${qs}`);
  },
};

export const bookingsApi = {
  me: (status?: string) =>
    request<BookingResponse[]>(`/api/bookings/me${status ? `?status=${status}` : ''}`),
  get: (id: number) => request<BookingResponse>(`/api/bookings/${id}`),
  hold: (body: BookingHoldRequest) =>
    request<BookingHoldResponse>('/api/bookings/hold', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  create: (body: BookingCreateRequest) =>
    request<BookingResponse>('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id: number) => request<void>(`/api/bookings/${id}`, { method: 'DELETE' }),
  releaseHold: (holdToken: string) =>
    request<void>(`/api/bookings/hold/${holdToken}`, { method: 'DELETE' }),
};

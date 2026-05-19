// API response and request types matching the OpenAPI spec

export interface PerformanceResponse {
  performanceId: number;
  title: string;
  description: string;
  posterImageUrl?: string;
  bookingStartAt: string;
  bookingEndAt: string;
  totalSeats: number;
  availableSeats: number;
}

export interface PerformanceCreateRequest {
  rentalId: number;
  title: string;
  description?: string;
  posterImageUrl?: string;
  bookingStartAt: string;
  bookingEndAt: string;
  totalSeats: number;
  maxSeatsPerPerson: number;
}

export interface PerformanceUpdateRequest {
  title?: string;
  description?: string;
  posterImageUrl?: string;
  bookingStartAt: string;
  bookingEndAt: string;
}

export interface PagePerformanceResponse {
  totalPages: number;
  totalElements: number;
  content: PerformanceResponse[];
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SeatStatusResponse {
  seatId: number;
  rowNum: string;
  colNum: number;
  label: string;
  status: 'AVAILABLE' | 'SELECTING' | 'RESERVED' | 'UNAVAILABLE';
}

export interface SeatCreateRequest {
  templateId: number;
  rows: number;
  cols: number;
  disabledSeats?: string[];
}

export interface SeatUpdateRequest {
  disabledSeats?: string[];
}

export interface SeatTemplateResponse {
  templateId: number;
  name: string;
  rows: number;
  cols: number;
  layout: string;
}

export interface RentalResponse {
  rentalId: number;
  eventName: string;
  useDate: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface RentalCreateRequest {
  applicantName: string;
  studentId: string;
  phone: string;
  clubName?: string;
  activityName?: string;
  eventName: string;
  eventDescription?: string;
  useDate: string;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
}

export interface RentalCheckRequest {
  useDate: string;
  startTime: string;
  endTime: string;
}

export interface RentalCheckResponse {
  available: boolean;
  conflicts: RentalResponse[];
}

export interface BookingResponse {
  bookingId: number;
  performanceId: number;
  performanceTitle: string;
  seatCount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface BookingCreateRequest {
  holdToken: string;
  performanceId: number;
  seatIds: number[];
}

export interface BookingHoldRequest {
  performanceId: number;
  seatIds: number[];
}

export interface BookingHoldResponse {
  holdToken: string;
  expiresAt: string;
}

export interface PerformanceBookingStatusResponse {
  performanceId: number;
  totalSeats: number;
  availableSeats: number;
  confirmedBookings: number;
}

export interface LoginRequest {
  idToken: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
}

export interface PosterUploadResponse {
  imageUrl: string;
}

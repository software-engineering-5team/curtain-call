// Types for the performance hall reservation system

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  createdAt: Date;
}

export interface VenueRental {
  id: string;
  applicantName: string;
  studentId: string;
  contact: string;
  clubName?: string;
  activityName?: string;
  eventName: string;
  eventDescription: string;
  useDate: Date;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  userId: string;
}

export interface Performance {
  id: string;
  rentalId: string;
  title: string;
  posterUrl?: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  totalSeats: number;
  availableSeats: number;
  maxSeatsPerPerson: number;
  bookingStartDate: Date;
  bookingEndDate: Date;
  createdAt: Date;
  organizerId: string;
}

export interface Seat {
  id: string;
  performanceId: string;
  row: string;
  number: number;
  status: 'available' | 'selecting' | 'reserved' | 'unavailable';
  reservedBy?: string;
}

export interface Reservation {
  id: string;
  performanceId: string;
  userId: string;
  seats: Seat[];
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}

export type SeatStatus = 'available' | 'selecting' | 'reserved' | 'unavailable';

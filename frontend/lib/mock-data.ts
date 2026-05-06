import { Performance, VenueRental, Reservation, Seat, User } from './types';

// Mock current user
export const currentUser: User = {
  id: 'user-1',
  name: '홍길동',
  email: 'hong@kookmin.ac.kr',
  studentId: '20210001',
  createdAt: new Date('2024-03-01'),
};

// Mock performances
export const performances: Performance[] = [
  {
    id: 'perf-1',
    rentalId: 'rental-1',
    title: '봄날의 음악회',
    posterUrl: '/posters/concert1.jpg',
    description: '국민대학교 음악동아리 연합의 봄 정기 공연입니다. 클래식부터 K-POP까지 다양한 장르의 음악을 선보입니다.',
    date: new Date('2026-05-20'),
    startTime: '19:00',
    endTime: '21:00',
    venue: '복지관 공연장',
    totalSeats: 120,
    availableSeats: 45,
    maxSeatsPerPerson: 4,
    bookingStartDate: new Date('2026-05-01'),
    bookingEndDate: new Date('2026-05-19'),
    createdAt: new Date('2026-04-15'),
    organizerId: 'user-2',
  },
  {
    id: 'perf-2',
    rentalId: 'rental-2',
    title: '연극 - 청춘예찬',
    posterUrl: '/posters/theater1.jpg',
    description: '연극동아리 무대의 제15회 정기 공연. 청춘의 방황과 성장을 그린 창작 연극입니다.',
    date: new Date('2026-05-25'),
    startTime: '18:00',
    endTime: '20:30',
    venue: '복지관 공연장',
    totalSeats: 100,
    availableSeats: 82,
    maxSeatsPerPerson: 2,
    bookingStartDate: new Date('2026-05-10'),
    bookingEndDate: new Date('2026-05-24'),
    createdAt: new Date('2026-04-20'),
    organizerId: 'user-3',
  },
  {
    id: 'perf-3',
    rentalId: 'rental-3',
    title: '댄스 페스티벌 2026',
    posterUrl: '/posters/dance1.jpg',
    description: '국민대 댄스 동아리들의 합동 공연! 스트릿, 방송댄스, 비보잉 등 다양한 장르를 만나보세요.',
    date: new Date('2026-06-01'),
    startTime: '17:00',
    endTime: '19:30',
    venue: '복지관 공연장',
    totalSeats: 150,
    availableSeats: 150,
    maxSeatsPerPerson: 4,
    bookingStartDate: new Date('2026-05-15'),
    bookingEndDate: new Date('2026-05-31'),
    createdAt: new Date('2026-04-25'),
    organizerId: 'user-4',
  },
  {
    id: 'perf-4',
    rentalId: 'rental-4',
    title: '밴드 콘서트 - 함성',
    posterUrl: '/posters/band1.jpg',
    description: '록밴드 동아리 함성의 연말 콘서트. 오리지널 곡과 커버곡을 함께 들려드립니다.',
    date: new Date('2026-06-10'),
    startTime: '19:30',
    endTime: '22:00',
    venue: '복지관 공연장',
    totalSeats: 120,
    availableSeats: 98,
    maxSeatsPerPerson: 3,
    bookingStartDate: new Date('2026-05-25'),
    bookingEndDate: new Date('2026-06-09'),
    createdAt: new Date('2026-05-01'),
    organizerId: 'user-5',
  },
];

// Mock venue rentals
export const venueRentals: VenueRental[] = [
  {
    id: 'rental-1',
    applicantName: '김민수',
    studentId: '20200123',
    contact: '010-1234-5678',
    clubName: '음악동아리 연합',
    activityName: '정기 공연',
    eventName: '봄날의 음악회',
    eventDescription: '음악동아리 연합 봄 정기 공연',
    useDate: new Date('2026-05-20'),
    startTime: '18:00',
    endTime: '22:00',
    expectedAttendees: 120,
    status: 'confirmed',
    createdAt: new Date('2026-04-01'),
    userId: 'user-2',
  },
  {
    id: 'rental-2',
    applicantName: '이지영',
    studentId: '20190456',
    contact: '010-2345-6789',
    clubName: '연극동아리 무대',
    activityName: '정기 공연',
    eventName: '연극 - 청춘예찬',
    eventDescription: '제15회 정기 공연',
    useDate: new Date('2026-05-25'),
    startTime: '17:00',
    endTime: '21:00',
    expectedAttendees: 100,
    status: 'confirmed',
    createdAt: new Date('2026-04-10'),
    userId: 'user-3',
  },
];

// Mock reservations for current user
export const myReservations: Reservation[] = [
  {
    id: 'res-1',
    performanceId: 'perf-1',
    userId: 'user-1',
    seats: [
      { id: 'seat-1', performanceId: 'perf-1', row: 'A', number: 5, status: 'reserved', reservedBy: 'user-1' },
      { id: 'seat-2', performanceId: 'perf-1', row: 'A', number: 6, status: 'reserved', reservedBy: 'user-1' },
    ],
    status: 'confirmed',
    createdAt: new Date('2026-05-02'),
  },
];

// Mock my venue rentals
export const myVenueRentals: VenueRental[] = [
  {
    id: 'rental-my-1',
    applicantName: '홍길동',
    studentId: '20210001',
    contact: '010-9876-5432',
    clubName: '코딩동아리 비트',
    activityName: 'IT 세미나',
    eventName: 'AI와 미래 기술 세미나',
    eventDescription: 'AI 기술의 현재와 미래에 대한 세미나입니다.',
    useDate: new Date('2026-06-15'),
    startTime: '14:00',
    endTime: '17:00',
    expectedAttendees: 80,
    status: 'confirmed',
    createdAt: new Date('2026-05-05'),
    userId: 'user-1',
  },
];

// Generate seats for a performance
export function generateSeats(performanceId: string, rows: number, seatsPerRow: number): Seat[] {
  const seats: Seat[] = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      const status = Math.random() > 0.7 ? 'reserved' : Math.random() > 0.9 ? 'unavailable' : 'available';
      seats.push({
        id: `${performanceId}-${rowLabels[r]}-${s}`,
        performanceId,
        row: rowLabels[r],
        number: s,
        status: status as 'available' | 'reserved' | 'unavailable',
        reservedBy: status === 'reserved' ? `user-${Math.floor(Math.random() * 100)}` : undefined,
      });
    }
  }
  
  return seats;
}

// Get performance by ID
export function getPerformanceById(id: string): Performance | undefined {
  return performances.find(p => p.id === id);
}

// Format date to Korean format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

// Format time
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? '오후' : '오전';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${ampm} ${displayHour}:${minutes}`;
}

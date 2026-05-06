'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  SeatLayoutPanel,
  BookingSettingsPanel,
  SeatPreviewGrid,
  SeatConfigSuccessCard,
  type SeatConfigSeat,
} from '@/components/features/seat-config';

type SaveStatus = 'idle' | 'success';
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function SeatConfigPage() {
  const [rows, setRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [disabledSeats, setDisabledSeats] = useState<Set<string>>(new Set());
  const [bookingStartDate, setBookingStartDate] = useState<Date | undefined>();
  const [bookingEndDate, setBookingEndDate] = useState<Date | undefined>();
  const [maxSeatsPerPerson, setMaxSeatsPerPerson] = useState(4);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const seats = useMemo<SeatConfigSeat[]>(() => {
    const list: SeatConfigSeat[] = [];
    for (let r = 0; r < rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        const seatId = `${ROW_LABELS[r]}-${s}`;
        list.push({ row: ROW_LABELS[r], number: s, disabled: disabledSeats.has(seatId) });
      }
    }
    return list;
  }, [rows, seatsPerRow, disabledSeats]);

  const groupedSeats = useMemo(() => {
    const groups: Record<string, SeatConfigSeat[]> = {};
    seats.forEach(seat => {
      if (!groups[seat.row]) groups[seat.row] = [];
      groups[seat.row].push(seat);
    });
    return groups;
  }, [seats]);

  const totalSeats = rows * seatsPerRow;
  const availableSeats = totalSeats - disabledSeats.size;

  const toggleSeat = (row: string, number: number) => {
    const seatId = `${row}-${number}`;
    setDisabledSeats(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  };

  if (saveStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userName="홍길동" />
        <main className="flex-1 flex items-center justify-center p-4">
          <SeatConfigSuccessCard
            totalSeats={totalSeats}
            availableSeats={availableSeats}
            bookingStartDate={bookingStartDate}
            bookingEndDate={bookingEndDate}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName="홍길동" />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            마이페이지로 돌아가기
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">좌석 설정</h1>
            <p className="text-muted-foreground">
              공연 좌석 배치를 설정하고 예매 가능 기간을 지정하세요
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">설정 중인 공연</p>
                  <p className="font-semibold text-lg">AI와 미래 기술 세미나</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>2026년 6월 15일</span>
                  <Badge variant="outline">확정됨</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <SeatLayoutPanel
                rows={rows}
                setRows={setRows}
                seatsPerRow={seatsPerRow}
                setSeatsPerRow={setSeatsPerRow}
                totalSeats={totalSeats}
                disabledCount={disabledSeats.size}
                availableSeats={availableSeats}
              />
              <BookingSettingsPanel
                bookingStartDate={bookingStartDate}
                setBookingStartDate={setBookingStartDate}
                bookingEndDate={bookingEndDate}
                setBookingEndDate={setBookingEndDate}
                maxSeatsPerPerson={maxSeatsPerPerson}
                setMaxSeatsPerPerson={setMaxSeatsPerPerson}
              />
              <Button size="lg" className="w-full" onClick={() => setSaveStatus('success')}>
                좌석 설정 저장
              </Button>
            </div>

            <div className="lg:col-span-2">
              <SeatPreviewGrid groupedSeats={groupedSeats} onToggle={toggleSeat} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

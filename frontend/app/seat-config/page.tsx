'use client';

import { useState, useMemo, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import {
  SeatLayoutPanel,
  BookingSettingsPanel,
  SeatPreviewGrid,
  SeatConfigSuccessCard,
  type SeatConfigSeat,
} from '@/components/features/seat-config';
import { performancesApi, seatsApi, rentalsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';
import type {
  PerformanceResponse,
  RentalResponse,
  SeatTemplateResponse,
  PerformanceCreateRequest,
} from '@/lib/api-types';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function SeatConfigContent() {
  const searchParams = useSearchParams();
  const performanceIdParam = searchParams.get('performanceId');
  const rentalIdParam = searchParams.get('rentalId');

  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [rental, setRental] = useState<RentalResponse | null>(null);
  const [templates, setTemplates] = useState<SeatTemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Performance creation fields (only used when creating from a rental)
  const [perfTitle, setPerfTitle] = useState('');
  const [perfDesc, setPerfDesc] = useState('');

  const [rows, setRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [disabledSeats, setDisabledSeats] = useState<Set<string>>(new Set());
  const [bookingStartDate, setBookingStartDate] = useState<Date | undefined>();
  const [bookingEndDate, setBookingEndDate] = useState<Date | undefined>();
  const [maxSeatsPerPerson, setMaxSeatsPerPerson] = useState(4);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tpls] = await Promise.all([seatsApi.templates()]);
        setTemplates(tpls);

        if (performanceIdParam) {
          const perf = await performancesApi.get(Number(performanceIdParam));
          setPerformance(perf);
        } else if (rentalIdParam) {
          const r = await rentalsApi.get(Number(rentalIdParam));
          setRental(r);
          setPerfTitle(r.eventName);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [performanceIdParam, rentalIdParam]);

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

  const handleSave = async () => {
    setSaveStatus('saving');
    setError('');
    try {
      const disabledList = Array.from(disabledSeats);
      const defaultTemplate = templates[0];
      if (!defaultTemplate) throw new Error('좌석 템플릿이 없습니다.');

      let targetPerformanceId: number;

      if (performance) {
        // Update existing performance's seat layout
        targetPerformanceId = performance.performanceId;

        // Update booking settings
        if (bookingStartDate && bookingEndDate) {
          await performancesApi.update(targetPerformanceId, {
            title: performance.title,
            description: performance.description,
            posterImageUrl: performance.posterImageUrl,
            bookingStartAt: bookingStartDate.toISOString(),
            bookingEndAt: bookingEndDate.toISOString(),
          });
        }

        // Try to create seats, fall back to update
        try {
          await seatsApi.create(targetPerformanceId, {
            templateId: defaultTemplate.templateId,
            rows,
            cols: seatsPerRow,
            disabledSeats: disabledList,
          });
        } catch {
          await seatsApi.update(targetPerformanceId, { disabledSeats: disabledList });
        }
      } else if (rental) {
        // Create new performance then configure seats
        if (!perfTitle) throw new Error('공연 제목을 입력해주세요.');
        if (!bookingStartDate || !bookingEndDate) throw new Error('예매 기간을 설정해주세요.');

        const perfReq: PerformanceCreateRequest = {
          rentalId: rental.rentalId,
          title: perfTitle,
          description: perfDesc,
          bookingStartAt: bookingStartDate.toISOString(),
          bookingEndAt: bookingEndDate.toISOString(),
          totalSeats: availableSeats,
          maxSeatsPerPerson,
        };
        const newPerf = await performancesApi.create(perfReq);
        targetPerformanceId = newPerf.performanceId;
        setPerformance(newPerf);

        await seatsApi.create(targetPerformanceId, {
          templateId: defaultTemplate.templateId,
          rows,
          cols: seatsPerRow,
          disabledSeats: disabledList,
        });
      } else {
        throw new Error('공연 또는 대여 정보가 필요합니다. URL에 performanceId 또는 rentalId를 포함해주세요.');
      }

      setSaveStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (saveStatus === 'success') {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <SeatConfigSuccessCard
          totalSeats={totalSeats}
          availableSeats={availableSeats}
          bookingStartDate={bookingStartDate}
          bookingEndDate={bookingEndDate}
        />
      </main>
    );
  }

  const displayName = performance?.title ?? rental?.eventName ?? '공연';
  const displayDate = rental?.useDate
    ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(rental.useDate))
    : '';

  return (
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
          <p className="text-muted-foreground">공연 좌석 배치를 설정하고 예매 가능 기간을 지정하세요</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(performance || rental) && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {rental && !performance ? '공연 등록 중인 대여' : '설정 중인 공연'}
                  </p>
                  <p className="font-semibold text-lg">{displayName}</p>
                </div>
                {displayDate && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{displayDate}</span>
                    <Badge variant="outline">확정됨</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance title/desc fields when creating from rental */}
        {rental && !performance && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">공연 제목 *</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={perfTitle}
                  onChange={e => setPerfTitle(e.target.value)}
                  placeholder="공연 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">공연 소개</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
                  rows={3}
                  value={perfDesc}
                  onChange={e => setPerfDesc(e.target.value)}
                  placeholder="공연 소개를 입력하세요"
                />
              </div>
            </CardContent>
          </Card>
        )}

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
            <Button
              size="lg"
              className="w-full"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <span className="flex items-center gap-2"><Spinner /> 저장 중...</span>
              ) : (
                '좌석 설정 저장'
              )}
            </Button>
          </div>

          <div className="lg:col-span-2">
            <SeatPreviewGrid groupedSeats={groupedSeats} onToggle={toggleSeat} />
          </div>
        </div>
      </div>
    </main>
  );
}

function SeatConfigGuard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      showAuthRequiredToast();
      setRedirecting(true);
      router.replace('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || redirecting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    }>
      <SeatConfigContent />
    </Suspense>
  );
}

export default function SeatConfigPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SeatConfigGuard />
      <Footer />
    </div>
  );
}

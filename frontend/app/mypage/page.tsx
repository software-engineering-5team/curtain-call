'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Building, Calendar, Ticket } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';
import { rentalsApi, performancesApi, bookingsApi } from '@/lib/api';
import type { RentalResponse, PerformanceResponse, BookingResponse } from '@/lib/api-types';
import {
  UserProfileCard,
  RentalHistoryList,
  MyPerformancesList,
  ReservationHistoryList,
} from '@/components/features/mypage';

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [myPerformances, setMyPerformances] = useState<PerformanceResponse[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      showAuthRequiredToast();
      router.push('/');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      rentalsApi.me(),
      performancesApi.me(),
      bookingsApi.me(),
    ])
      .then(([r, p, b]) => {
        setRentals(r);
        setMyPerformances(p);
        setBookings(b);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [user]);

  const handleCancelRental = async (rentalId: number) => {
    try {
      const updated = await rentalsApi.cancel(rentalId);
      setRentals(prev => prev.map(r => r.rentalId === rentalId ? updated : r));
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : '대여 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(prev =>
        prev.map(b => b.bookingId === bookingId ? { ...b, status: 'CANCELLED' as const } : b)
      );
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : '예매 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserProfileCard user={user!} />

          {dataLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <Tabs defaultValue="rentals" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="rentals" className="gap-2">
                  <Building className="w-4 h-4 hidden sm:block" />
                  대여 신청
                </TabsTrigger>
                <TabsTrigger value="performances" className="gap-2">
                  <Calendar className="w-4 h-4 hidden sm:block" />
                  내 공연
                </TabsTrigger>
                <TabsTrigger value="reservations" className="gap-2">
                  <Ticket className="w-4 h-4 hidden sm:block" />
                  예매 내역
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rentals">
                <RentalHistoryList rentals={rentals} onCancel={handleCancelRental} />
              </TabsContent>

              <TabsContent value="performances">
                <MyPerformancesList performances={myPerformances} />
              </TabsContent>

              <TabsContent value="reservations">
                <ReservationHistoryList bookings={bookings} onCancel={handleCancelBooking} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

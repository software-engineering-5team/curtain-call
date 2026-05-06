'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Calendar, Ticket } from 'lucide-react';
import {
  currentUser,
  myVenueRentals,
  myReservations,
  performances,
} from '@/lib/mock-data';
import {
  UserProfileCard,
  RentalHistoryList,
  MyPerformancesList,
  ReservationHistoryList,
} from '@/components/features/mypage';

export default function MyPage() {
  const [rentals, setRentals] = useState(myVenueRentals);
  const [reservations, setReservations] = useState(myReservations);

  const handleCancelRental = (rentalId: string) => {
    setRentals(prev =>
      prev.map(r => (r.id === rentalId ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  const getPerformance = (performanceId: string) =>
    performances.find(p => p.id === performanceId);

  const myPerformances = performances.filter(p => p.organizerId === 'user-1');

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userName={currentUser.name} />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserProfileCard user={currentUser} />

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
              <ReservationHistoryList
                reservations={reservations}
                getPerformance={getPerformance}
                onCancel={handleCancelReservation}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

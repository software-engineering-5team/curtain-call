import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProtectedLink } from '@/components/protected-link';
import { Building, Ticket } from 'lucide-react';

/** 홈 하단 CTA. */
export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              국민대학교 학생이라면 누구나 공연장을 대여하고 공연을 예매할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProtectedLink href="/rental">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  <Building className="w-5 h-5" />대여 신청하기
                </Button>
              </ProtectedLink>
              <Link href="/performances">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Ticket className="w-5 h-5" />공연 예매하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

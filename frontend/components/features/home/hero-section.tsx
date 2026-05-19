import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedLink } from '@/components/protected-link';
import { Building, Ticket } from 'lucide-react';

/** 홈 페이지 상단 히어로. 학교 톤(COMMON-006) 을 유지한다. */
export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">국민대학교 공식 서비스</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            복지관 공연장<br />
            <span className="text-primary">대여 및 예매</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            국민대학교 학생들을 위한 복지관 공연장 대여 신청과<br className="hidden sm:block" />
            공연 좌석 예매를 한 곳에서 편리하게 이용하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ProtectedLink href="/rental">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Building className="w-5 h-5" />공연장 대여 신청
              </Button>
            </ProtectedLink>
            <Link href="/performances">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Ticket className="w-5 h-5" />공연 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

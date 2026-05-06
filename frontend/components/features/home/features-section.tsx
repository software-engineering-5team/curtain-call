import { Card, CardContent } from '@/components/ui/card';
import { Building, Calendar, Ticket } from 'lucide-react';

/** 홈 페이지 "주요 기능" 3컬럼 카드. */
export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">주요 기능</h2>
          <p className="text-muted-foreground">간편한 대여 신청부터 좌석 예매까지</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Building className="w-6 h-6 text-primary" />}
            title="공연장 대여"
            description="복지관 공연장을 손쉽게 대여하세요. 신청 즉시 확정되며, 일정 충돌 시 안내해 드립니다."
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6 text-primary" />}
            title="공연 등록"
            description="대여 확정 후 공연 정보를 등록하고, 좌석 배치를 직접 설정할 수 있습니다."
          />
          <FeatureCard
            icon={<Ticket className="w-6 h-6 text-primary" />}
            title="좌석 예매"
            description="등록된 공연의 좌석을 직접 선택하여 예매하세요. 실시간 좌석 현황을 확인할 수 있습니다."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

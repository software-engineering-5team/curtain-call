import { Card, CardContent } from '@/components/ui/card';

/** 홈 페이지 이용 방법 섹션. 운영자/일반 학생 두 페르소나의 흐름을 보여준다. */
export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">이용 방법</h2>
          <p className="text-muted-foreground">간단한 단계로 공연장을 대여하고 공연을 예매하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PersonaCard
            title="공연 운영자"
            steps={[
              { label: '구글 계정 로그인', detail: '국민대학교 이메일로 로그인' },
              { label: '대여 신청', detail: '원하는 날짜와 시간 선택' },
              { label: '공연 등록', detail: '공연 정보 및 좌석 설정' },
            ]}
          />
          <PersonaCard
            title="일반 학생"
            steps={[
              { label: '공연 둘러보기', detail: '등록된 공연 목록 확인' },
              { label: '좌석 선택', detail: '원하는 좌석을 직접 선택' },
              { label: '예매 완료', detail: '즉시 예매 확정' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ title, steps }: { title: string; steps: { label: string; detail: string }[] }) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-4 text-lg">{title}</h3>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary-foreground">{i + 1}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

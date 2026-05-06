import { cn } from '@/lib/utils';

interface SeatLegendProps {
  className?: string;
}

/** 좌석 상태별 색상 범례. SEAT-002 의 4가지 상태를 시각화한다. */
export function SeatLegend({ className }: SeatLegendProps) {
  return (
    <div className={cn('flex flex-wrap gap-4 text-sm', className)}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-primary/20 border border-primary/40" />
        <span className="text-muted-foreground">예매 가능</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-[oklch(0.65_0.2_280)] border-[oklch(0.65_0.2_280)]" />
        <span className="text-muted-foreground">선택됨</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-muted border border-muted-foreground/20" />
        <span className="text-muted-foreground">예매 완료</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-muted/50" />
        <span className="text-muted-foreground">사용 불가</span>
      </div>
    </div>
  );
}

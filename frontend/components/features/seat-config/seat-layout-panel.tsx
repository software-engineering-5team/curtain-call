'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';

interface Props {
  rows: number;
  setRows: (n: number) => void;
  seatsPerRow: number;
  setSeatsPerRow: (n: number) => void;
  totalSeats: number;
  disabledCount: number;
  availableSeats: number;
}

/** 행/열 슬라이더 + 좌석 수 요약. SEAT-009 의 totalSeats 계산을 시각화. */
export function SeatLayoutPanel({
  rows, setRows, seatsPerRow, setSeatsPerRow, totalSeats, disabledCount, availableSeats,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          좌석 배치
        </CardTitle>
        <CardDescription>행과 열 수를 조절하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>행 수</Label>
            <span className="text-sm font-medium">{rows}행</span>
          </div>
          <Slider value={[rows]} onValueChange={(v) => setRows(v[0])} min={1} max={15} step={1} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>열 수 (행당 좌석)</Label>
            <span className="text-sm font-medium">{seatsPerRow}석</span>
          </div>
          <Slider value={[seatsPerRow]} onValueChange={(v) => setSeatsPerRow(v[0])} min={5} max={20} step={1} />
        </div>

        <Separator />

        <div className="space-y-2">
          <Row label="총 좌석" value={`${totalSeats}석`} />
          <Row label="사용 불가" value={`${disabledCount}석`} accent="text-destructive" />
          <Row label="예매 가능" value={`${availableSeats}석`} accent="text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${accent ?? ''}`}>{value}</span>
    </div>
  );
}

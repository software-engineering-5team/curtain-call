'use client';

import { cn } from '@/lib/utils';
import { SeatStatus } from '@/lib/types';

interface SeatButtonProps {
  row: string;
  number: number;
  status: SeatStatus;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 단일 좌석 버튼.
 * 상태 머신 규칙(SEAT-002, SEAT-007)을 시각적으로 표현하는 가장 작은 단위.
 */
export function SeatButton({ row, number, status, isSelected, onClick, disabled, size = 'md' }: SeatButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const statusClasses = {
    available: 'bg-primary/20 hover:bg-primary/40 border-primary/40 text-primary cursor-pointer',
    selecting: 'bg-[oklch(0.65_0.2_280)] border-[oklch(0.65_0.2_280)] text-white',
    reserved: 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed',
    unavailable: 'bg-muted/50 border-transparent text-muted-foreground/50 cursor-not-allowed',
  };

  const isClickable = status === 'available' || isSelected;

  return (
    <button
      type="button"
      className={cn(
        'rounded-md border flex items-center justify-center font-medium transition-all',
        sizeClasses[size],
        isSelected ? statusClasses.selecting : statusClasses[status],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={isClickable && !disabled ? onClick : undefined}
      disabled={!isClickable || disabled}
      title={`${row}${number} - ${
        status === 'available' ? '예매 가능' :
        status === 'selecting' ? '선점 중' :
        status === 'reserved' ? '예매 완료' : '사용 불가'
      }`}
    >
      {number}
    </button>
  );
}

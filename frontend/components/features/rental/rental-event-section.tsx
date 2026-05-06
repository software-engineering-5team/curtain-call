'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RentalFormData } from './rental-form-types';

interface Props {
  formData: RentalFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/** 행사 정보(공연/행사명, 설명, 예상 인원). */
export function RentalEventSection({ formData, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground border-b border-border pb-2">행사 정보</h3>

      <div className="space-y-2">
        <Label htmlFor="eventName">공연/행사명 *</Label>
        <Input
          id="eventName"
          name="eventName"
          placeholder="행사 제목을 입력하세요"
          value={formData.eventName}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventDescription">행사 설명 *</Label>
        <Textarea
          id="eventDescription"
          name="eventDescription"
          placeholder="행사에 대한 간략한 설명을 입력하세요"
          value={formData.eventDescription}
          onChange={onChange}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedAttendees">예상 인원 *</Label>
        <Input
          id="expectedAttendees"
          name="expectedAttendees"
          type="number"
          placeholder="예상 참석 인원"
          value={formData.expectedAttendees}
          onChange={onChange}
          min={1}
          max={200}
          required
        />
      </div>
    </div>
  );
}

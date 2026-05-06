'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RentalFormData } from './rental-form-types';

interface Props {
  formData: RentalFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/** 신청자 정보(이름, 학번, 연락처, 동아리, 활동명). 학번은 인증으로 자동 채우므로 disabled. */
export function RentalApplicantSection({ formData, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground border-b border-border pb-2">신청자 정보</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicantName">신청자 이름</Label>
          <Input
            id="applicantName"
            name="applicantName"
            value={formData.applicantName}
            onChange={onChange}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">학번</Label>
          <Input
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={onChange}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">연락처 *</Label>
          <Input
            id="contact"
            name="contact"
            placeholder="010-0000-0000"
            value={formData.contact}
            onChange={onChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clubName">소속 동아리명</Label>
          <Input
            id="clubName"
            name="clubName"
            placeholder="동아리명 (선택)"
            value={formData.clubName}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activityName">활동명</Label>
        <Input
          id="activityName"
          name="activityName"
          placeholder="정기 공연, 세미나 등 (선택)"
          value={formData.activityName}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

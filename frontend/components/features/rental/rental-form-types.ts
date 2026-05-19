export interface RentalFormData {
  applicantName: string;
  studentId: string;
  contact: string;
  clubName: string;
  activityName: string;
  eventName: string;
  eventDescription: string;
  expectedAttendees: string;
}

export const initialRentalFormData: RentalFormData = {
  applicantName: '',
  studentId: '',
  contact: '',
  clubName: '',
  activityName: '',
  eventName: '',
  eventDescription: '',
  expectedAttendees: '',
};

export type RentalSubmissionStatus = 'idle' | 'success' | 'conflict';

export interface ICreateEventRequest {
  title: string;
  address: string;
  startTime: string;
  registrationCloseTime: string;
  durationMinutes: number;
  paymentAmount: number;
  participantCount: number;
  additionalInfo?: string;
}

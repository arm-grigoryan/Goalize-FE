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

export interface IEventHostUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  profilePicStatus: string | null;
}

export interface IEvent {
  id: number;
  hostId: number;
  hostUser: IEventHostUser;
  name: string;
  address: string;
  startTime: string;
  registrationCloseDate?: string | null;
  registrationAmount?: number | null;
  participatedPlayersCount: number;
  state: string;
  imageUrl?: string | null;
}

export interface IEventsResponse {
  items: IEvent[];
  total: number;
}

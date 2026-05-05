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

export interface IEventDetailHostUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  profilePicStatus: string;
  birthDate: string;
  age: number;
  workingFoot: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
}

export interface IEventParticipantUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  profilePicStatus: string;
  birthDate: string;
  age: number;
  workingFoot: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
}

export interface IEventParticipant {
  id: number;
  playerId: number;
  userInfo: IEventParticipantUserInfo;
}

export interface IEventDetail {
  id: number;
  hostId: number;
  hostUser: IEventDetailHostUser;
  name: string;
  additionalInfo: string | null;
  address: string;
  startTime: string;
  duration: number;
  requiredPlayersAmount: number;
  participatedPlayersCount: number;
  registrationCloseDate: string | null;
  registrationAmount: number | null;
  state: 'Upcoming' | 'Past' | 'Cancelled';
  createDate: string;
  updateDate: string;
  participants: IEventParticipant[];
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

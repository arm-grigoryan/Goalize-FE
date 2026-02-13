export type NotificationStatus = "Unseen" | "Seen";

export type NotificationFlowType = "TeamInvitation" | "TeamApplication" | string;

export interface NotificationItemDto {
  id: string;
  templateKey: string;
  data: string;
  status: NotificationStatus;
  createdAtUtc?: string;
  notificationRelatedFlowType?: NotificationFlowType | null;
  notificationRelatedFlowId?: number | null;
  flowCompleted?: boolean;
}

export interface TeamInfoPayload {
  id: number;
  name: string;
  logoUrl?: string;
  captainId?: number;
}

export interface UserInfoPayload {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePic?: string;
}

export interface NotificationPresentation {
  icon?: string;
  title: string;
  description: string;
}

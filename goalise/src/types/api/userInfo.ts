export interface IPlayerProfile {
  playerInfo: IPlayerInfo;
  profileCompletionInfo: IProfileCompletionInfo;
  relationshipState: IRelationshipState;
}

export interface IRelationshipState {
  pendingAppliedTeamIds: number[];
  pendingInvitedPlayerIds: number[];
}

export interface IPlayerInfo {
  id: number;
  userInfo: IUserInfo;
  shirtNumber: number;
  team: ITeam;
  draftTeamId?: number | null;
}

export interface IUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  profilePicStatus: "Pending" | "Approved" | "Rejected";
  birthDate: string;
  workingFoot: "Left" | "Right";
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  age: number;
}

export interface ITeam {
  id: number;
  name: string;
  logoUrl: string;
  captainId: number;
}

export interface IProfileCompletionInfo {
  steps: IProfileStep[];
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

export interface IProfileStep {
  key: string;
  name: string;
  iconUrl: string;
  percentage: number;
  completed: boolean;
}

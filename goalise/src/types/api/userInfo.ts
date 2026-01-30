export interface IPlayerProfile {
  playerInfo: IPlayerInfo;
  profileCompletionInfo: IProfileCompletionInfo;
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
  workingFoot: "Left" | "Right" | "Both";
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
  name: string;
  iconUrl: string;
  percentage: number;
  completed: boolean;
}

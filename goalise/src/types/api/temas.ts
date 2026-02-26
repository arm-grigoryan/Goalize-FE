export interface ITeam {
  id: number;
  name: string;
  logoUrl: string;
  captainPlayerId: number;
  captain: {
    id: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    profilePic: string;
    profilePicStatus: "Pending" | "Approved" | "Rejected";
    birthDate: "2025-10-08T12:44:58.131Z";
    workingFoot: "Left" | "Right";
  };
}

export interface ITeamInfo {
  id: number;
  name: string;
  abbreviation: string;
  logoUrl: string;
  captainId: number;
}

export interface ITeamCaptain {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  profilePicStatus: string;
  birthDate: string;
  age: number;
  workingFoot: string;
}

export interface ITeamListItem {
  team: ITeamInfo;
  matchDate: string;
  matchId: number | null;
  opponent: ITeamInfo | null;
  captain: ITeamCaptain;
}

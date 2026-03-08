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
  profilePic: string | null;
  profilePicStatus: string | null;
  birthDate: string;
  age: number;
  workingFoot: string | null;
}

export interface ITeamStats {
  win: number;
  draw: number;
  lose: number;
}

export interface ITeam {
  team: ITeamInfo;
  captain: ITeamCaptain;
  stats: ITeamStats;
}

export interface ITeamListItem {
  team: ITeamInfo;
  matchDate: string;
  matchId: number | null;
  opponent: ITeamInfo | null;
  captain: ITeamCaptain;
}

export interface INextMatchTeam {
  id: number;
  name: string;
  abbreviation: string;
  logoUrl: string;
  captainId: number;
}

export interface ITeamNextMatch {
  matchId: number;
  matchDate: string;
  isLive: boolean;
  homeTeam: INextMatchTeam;
  awayTeam: INextMatchTeam;
  league: {
    id: number;
    name: string;
    logoUrl: string;
    winner: number | null;
    state: string;
    maxTeamsCount: number;
    registrationDate: string;
    paymentPerGame: number;
    firstPlacePrize: number;
    secondPlacePrize: number;
    semiFinalistPrize: number | null;
  };
}

export interface ITeamTrophy {
  leagueId: number;
  leagueName: string;
  leagueLogoUrl: string;
  season: string;
  type: "Winner" | "RunnerUp" | "SemiFinalist";
}

export interface IPlayerProfileMatches {
  id: number;
  homeTeam: HomeTeam;
  awayTeam: AwayTeam;
  matchDate: string;
  homeTeamScore: number;
  awayTeamScore: number;
  playerGoalsCount: number;
  playerAssistsCount: number;
  playerYellowsCount: number;
  playerRedsCount: number;
}

export interface HomeTeam {
  id: number;
  name: string;
  abbreviation?: string;
  logoUrl: string;
  captainId: number;
}

export interface AwayTeam {
  id: number;
  name: string;
  abbreviation?: string;
  logoUrl: string;
  captainId: number;
}

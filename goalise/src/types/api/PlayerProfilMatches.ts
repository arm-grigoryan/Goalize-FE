export interface IPlayerProfileMatches {
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
  logoUrl: string;
  captainId: number;
}

export interface AwayTeam {
  id: number;
  name: string;
  logoUrl: string;
  captainId: number;
}

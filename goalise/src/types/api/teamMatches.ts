export interface ITeamMatchTeam {
  id: number;
  name: string;
  abbreviation: string;
  logoUrl: string;
  captainId: number;
}

export interface ITeamMatchLeague {
  id: number;
  name: string;
  logoUrl: string;
  winner: ITeamMatchTeam | null;
  state: string;
  maxTeamsCount: number;
  registrationDate: string;
  paymentPerGame: number;
  firstPlacePrize: number;
  secondPlacePrize: number;
  semiFinalistPrize: number | null;
}

export interface ITeamMatchResponse {
  match: {
    id: number;
    homeTeam: ITeamMatchTeam;
    awayTeam: ITeamMatchTeam;
    homeTeamScore: number;
    awayTeamScore: number;
    homeTeamPoints: number;
    awayTeamPoints: number;
    isLive: boolean;
    date: string;
    state: string;
    result: string;
  };
  league: ITeamMatchLeague;
}

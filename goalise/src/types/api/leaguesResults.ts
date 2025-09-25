export interface ILeaguesResultsItem {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
  awayTeam: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
  date: "2025-09-24T22:22:53.518Z";
  homeTeamScore: number;
  awayTeamScore: number;
}

export interface ILeaguesResults {
  additionalProp1: ILeaguesResultsItem[];
}

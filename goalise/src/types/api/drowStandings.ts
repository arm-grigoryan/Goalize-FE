export type IDrowStandings = root[];

export interface root {
  playoff: Playoff;
  matchesCount: number;
  matches: Match[];
}

export interface Playoff {
  id: number;
  name: string;
}

export interface DrawTeam {
  id: number;
  name: string;
  abbreviation?: string;
  logoUrl: string;
  captainId: number;
}

export interface Match {
  id: number;
  homeTeam: DrawTeam;
  awayTeam: DrawTeam;
  homeTeamScore: number;
  awayTeamScore: number;
  homeTeamPoints: number;
  awayTeamPoints: number;
  isLive: boolean;
  date: string;
  state: string;
  result: string;
  matchCount?: number;
}

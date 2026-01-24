import { AwayTeam, HomeTeam } from "./PlayerProfilMatches";

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

export interface Match {
  id: number;
  homeTeam: HomeTeam;
  awayTeam: AwayTeam;
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

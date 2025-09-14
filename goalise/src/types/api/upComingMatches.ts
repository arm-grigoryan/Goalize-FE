export interface UpcomingMatch {
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
  date: string;
  homeTeamPoints: number;
  awayTeamPoints: number;
  isLive: boolean;
}

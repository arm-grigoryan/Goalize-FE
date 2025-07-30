export interface IMatchUpComing {
  id: number;
  homeTeam: {
    id: null;
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
  date: "2025-07-30T18:45:24.969Z";
  homeTeamPoints: number;
  awayTeamPoints: number;
}

export interface ILeaguesGroupItem {
  id: number;
  matchesPlayed: number;
  goalsScored: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
  team: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
}

export interface ILeaguesGroup {
  additionalProp1: ILeaguesGroupItem[];
}

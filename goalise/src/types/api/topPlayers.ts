export interface ITopPlayer {
  teamPlayer: {
    id: number;
    playerId: number;
    userId: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    shirtNumber: number;
  };
  team: {
    id: number;
    name: string;
    abbreviation: string;
    logoUrl: string;
    captainId: number;
  };
  value: number;
}

export interface ITopPlayers {
  leagueId: number;
  topGoals: ITopPlayer[];
  topAssists: ITopPlayer[];
  topRatings: ITopPlayer[];
  topYellowCards: ITopPlayer[];
  topRedCards: ITopPlayer[];
}

export interface ITeamTopPlayerEntry {
  value: number;
  teamPlayer: {
    id: number;
    playerId: number;
    userId: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    shirtNumber: number;
  };
}

export interface ITeamTopPlayers {
  topGoal: ITeamTopPlayerEntry | null;
  topAssist: ITeamTopPlayerEntry | null;
  topYellowCard: ITeamTopPlayerEntry | null;
  topRedCard: ITeamTopPlayerEntry | null;
  topRating: ITeamTopPlayerEntry | null;
  topGoalKeeperRating: ITeamTopPlayerEntry | null;
  topSaves: ITeamTopPlayerEntry | null;
}

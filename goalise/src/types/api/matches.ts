type MatchHighlightPlayer = {
  id: number;
  playerId: number;
  userId: string;
  firstName: string;
  lastName: string;
  picture: string;
  shirtNumber: number;
};

export type MatchHighlight = {
  id: number;
  matchId: number;
  player: MatchHighlightPlayer;
  type: "Goal" | "RedCard" | "YellowCard" | "OwnGoal";
  order: number;
  relatedHighlight: {
    player: MatchHighlightPlayer;
  } | null;
};

export interface IMatches {
  id: number;
  matchPhase: {
    groupRound: {
      id: number;
      group: {
        id: number;
        name: string;
      };
      round: {
        id: number;
        roundNumber: number;
        name: string;
      };
    } | null;
    playoff: {
      id: number;
      name: string;
    } | null;
    stage: {
      id: number;
      leagueId: number;
      leagueName: string;
      order: number;
    };
    league: {
      id: number;
      name: string;
      logoUrl: string;
    };
  };
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
  homeTeamScore: number;
  awayTeamScore: number;
  date: string;
  state: "Upcoming" | "Live" | "Finished";
  homeTeamHighlights: MatchHighlight[];
  awayTeamHighlights: MatchHighlight[];
}

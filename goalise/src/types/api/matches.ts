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
    };
    playoff: {
      id: number;
      name: string;
    };
    stage: {
      id: number;
      leagueId: number;
      leagueName: string;
      order: number;
    };
    league: {
      id: 0;
      name: "string";
      logoUrl: "string";
    };
  };
  homeTeam: {
    id: 0;
    name: "string";
    logoUrl: "string";
    captainId: 0;
  };
  awayTeam: {
    id: 0;
    name: "string";
    logoUrl: "string";
    captainId: 0;
  };
  date: "2025-07-30T18:27:57.065Z";
  state: "Finished";
  homeTeamHighlights: [
    {
      id: 0;
      matchId: 0;
      player: {
        id: 0;
        playerId: 0;
        userId: "string";
        firstName: "string";
        lastName: "string";
        picture: "string";
        shirtNumber: 0;
      };
      type: "Goal";
    }
  ];
  awayTeamHighlights: [
    {
      id: 0;
      matchId: 0;
      player: {
        id: 0;
        playerId: 0;
        userId: "string";
        firstName: "string";
        lastName: "string";
        picture: "string";
        shirtNumber: 0;
      };
      type: "Goal";
    }
  ];
}

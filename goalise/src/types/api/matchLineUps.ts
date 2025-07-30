interface IMatchlineUp {
  id: number;
  playerId: number;
  userId: string;
  firstName: string;
  lastName: string;
  picture: string;
  shirtNumber: number;
}

export interface IMatchLineUps {
  matchId: number;
  homePlayers: IMatchlineUp[];
  awayPlayers: IMatchlineUp[];
}

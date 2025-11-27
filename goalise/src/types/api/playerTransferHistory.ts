export interface IPlayerTransferHistory {
  id: number;
  playerId: number;
  fromTeam: FromTeam;
  toTeam: ToTeam;
  transferDate: string;
}

export interface FromTeam {
  id: number;
  name: string;
  logoUrl: string;
  captainId: number;
}

export interface ToTeam {
  id: number;
  name: string;
  logoUrl: string;
  captainId: number;
}

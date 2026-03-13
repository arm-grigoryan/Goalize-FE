export interface ITransfers {
  id: number;
  playerId: number;
  userId: string;
  firstName: string;
  lastName: string;
  playerPicture: string;
  fromTeam: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
  toTeam: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
  transferType: "In" | "Out";
  transferDate: "2025-09-19T16:42:54.602Z";
}

export interface ITeamTransferTeam {
  id: number;
  name: string;
  abbreviation: string;
  logoUrl: string;
  captainId: number;
}

export interface ITeamTransfer {
  id: number;
  playerId: number;
  userId: string;
  firstName: string;
  lastName: string;
  playerPicture: string | null;
  fromTeam: ITeamTransferTeam;
  toTeam: ITeamTransferTeam;
  transferType: "In" | "Out";
  transferDate: string;
}

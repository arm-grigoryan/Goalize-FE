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

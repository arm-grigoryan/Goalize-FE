export interface ILegues {
  id: string;
  name: string;
  logoUrl: string;
}

export interface ILeague {
  id: number;
  name: string;
  logoUrl: string;
  winner: {
    id: number;
    name: string;
    logoUrl: string;
    captainId: number;
  };
  state: "Registration" | "Playing" | "Finished";
  maxTeamsCount: number;
  registrationDate: "2025-09-19T17:11:07.233Z";
  paymentPerGame: number;
  firstPlacePrize?: number;
  secondPlacePrize?: number;
  semiFinalistPrize?: number;
}

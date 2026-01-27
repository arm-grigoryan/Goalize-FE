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
  registrationDate: string;
  paymentPerGame: number;
  firstPlacePrize?: number;
  secondPlacePrize?: number;
  semiFinalistPrize?: number;
}

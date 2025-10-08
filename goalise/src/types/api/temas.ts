export interface ITeam {
  id: number;
  name: string;
  logoUrl: string;
  captainPlayerId: number;
  captain: {
    id: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    profilePic: string;
    profilePicStatus: "Pending" | "Approved" | "Rejected";
    birthDate: "2025-10-08T12:44:58.131Z";
    workingFoot: "Left" | "Right";
  };
}

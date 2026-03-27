import { StaticImageData } from "next/image";

export interface ITransferItemCardProps {
  date: string;
  fromTeamLogo?: string | StaticImageData;
  fromTeamName: string;
  fromTeamId?: number;
  toTeamLogo?: string | StaticImageData;
  toTeamName: string;
  toTeamId?: number;
  fromTeamNameToolTip?: string;
  toTeamNameToolTip?: string;
}

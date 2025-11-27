import { StaticImageData } from "next/image";

export interface ITransferItemCardProps {
  date: string;
  fromTeamLogo: string | StaticImageData;
  fromTeamName: string;
  toTeamLogo: string | StaticImageData;
  toTeamName: string;
  fromTeamNameToolTip?: string;
  toTeamNameToolTip?: string;
}

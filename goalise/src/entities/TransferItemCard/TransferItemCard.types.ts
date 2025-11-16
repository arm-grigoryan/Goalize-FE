import { StaticImageData } from "next/image";

export interface ITransferItemCardProps {
    dateIcon: string | StaticImageData;
    date: string;
    fromTeamLogo: string | StaticImageData;
    fromTeamName: string;
    arrowIcon: string | StaticImageData;
    toTeamLogo: string | StaticImageData;
    toTeamName: string;
}
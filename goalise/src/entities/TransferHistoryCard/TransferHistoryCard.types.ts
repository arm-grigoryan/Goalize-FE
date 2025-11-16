import { StaticImageData } from "next/image";
import { ITransferItemCardProps } from "../TransferItemCard/TransferItemCard.types";

export interface ITransferHistoryCardProps {
    icon?: string | StaticImageData;
    title?: string;
    context?: string;
    object?: ITransferItemCardProps[];
}
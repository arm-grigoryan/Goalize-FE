import { StaticImageData } from "next/image";
export interface IUnassignedPlayerCardProps {
    icon?: string | StaticImageData;
    title?: string;
    context?: string;
    link?: string;
    linkText?: string;
}
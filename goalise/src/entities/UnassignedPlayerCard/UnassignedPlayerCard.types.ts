import { StaticImageData } from "next/image";
import { Url } from "url";

export interface IUnassignedPlayerCardProps {
    icon?: string | StaticImageData;
    title?: string;
    context?: string;
    link?: string;
    linkText?: string;
}
import { StaticImageData } from "next/image";

export interface INotificationItemProps {
    icon?: StaticImageData;
    title?: string;
    description?: string;
    acceptButtonText?: string;
    denyButtonText?: string;
    onAcceptButtonClick?: () => void;
    onDenyButtonClick?: () => void;
}
import { StaticImageData } from "next/image";

export interface INotificationItemProps {
  id?: string;
  icon?: StaticImageData | string;
  title?: string;
  description?: string;
  acceptButtonText?: string;
  denyButtonText?: string;
  onAcceptButtonClick?: () => void;
  onDenyButtonClick?: () => void;
}

export interface INotificationItemProps {
    type?: string;
    status?: string;
    detail?: string;
    instance?: string;
    onAcceptButtonClick?: () => void;
    onDenieButtonClick?: () => void;
}
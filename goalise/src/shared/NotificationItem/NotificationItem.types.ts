export interface INotificationItemProps {
    icon?: string;
    title?: string;
    description?: string;
    acceptButtonText?: string;
    denyButtonText?: string;
    onAcceptButtonClick?: () => void;
    onDenyButtonClick?: () => void;
}
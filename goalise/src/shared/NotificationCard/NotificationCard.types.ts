import { INotificationItemProps } from "../NotificationItem/NotificationItem.types";

export interface INotificationCardProps {
  object?: INotificationItemProps[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

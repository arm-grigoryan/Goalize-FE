import React from "react";
import { INotificationCardProps } from "./NotificationCard.types";
import styles from './NotificationCard.module.css';
import { useTranslations } from "next-intl";
import { NotificationItem } from "../NotificationItem/NotificationItem";

export const NotificationCard:React.FC<INotificationCardProps> = ({
    object,
}) => {
    const t = useTranslations();
    return <div className={styles.container}>
            <div className={styles.title}>{t("home.notifications.title")}</div>
            <div className={styles.itemsContainer}> 
                {object?.map((item, index) => (
                <div key={index}>
                    <NotificationItem {...item} />
                </div>
            ))}
            </div>
    </div>
}
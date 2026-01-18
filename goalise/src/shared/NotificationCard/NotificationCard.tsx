import React from "react";
import { INotificationCardProps } from "./NotificationCard.types";
import styles from './NotificationCard.module.css';
import { useTranslations } from "next-intl";
import { NotificationItem } from "../NotificationItem/NotificationItem";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const NotificationCard:React.FC<INotificationCardProps> = ({
    object,
}) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const t = useTranslations();
    return <div className={`${isMobile ? styles.mobile : styles.container}`}>
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
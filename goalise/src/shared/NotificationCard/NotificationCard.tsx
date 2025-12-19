import React from "react";
import { INotificationCardProps } from "./NotificationCard.types";
import styles from './NotificationCard.module.css';
import Button from "../Button";

export const NotificationCard:React.FC<INotificationCardProps> = ({
    title
}) => {
    return <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            
    </div>
}
import React from "react";
import styles from "./NotificationPopUp.module.css";
import { INotificationPopUpProps } from "./NotificationPopUp.types";

export const NotificationPopUp: React.FC<INotificationPopUpProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {icon && (
          <div className={styles.icon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon} alt="" className={styles.iconImage} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import Button from "../Button";
import { INotificationItemProps } from "./NotificationItem.types";
import styles from "./NotificationItem.module.css";
import Image from "next/image";

const isRemoteImage = (icon?: INotificationItemProps["icon"]): icon is string =>
  typeof icon === "string";

export const NotificationItem: React.FC<INotificationItemProps> = ({
  icon,
  title,
  description,
  acceptButtonText,
  denyButtonText,
  onAcceptButtonClick,
  onDenyButtonClick,
  highlighted,
}) => {
  return (
    <div className={`${styles.container} ${highlighted ? styles.highlighted : ""}`}>
      {highlighted && <span className={styles.unseenDot} />}
      <div className={styles.info}>
        {icon && (
          <div className={styles.icon}>
            {isRemoteImage(icon) ? (
              <img src={icon} alt="" className={styles.iconImage} />
            ) : (
              <Image src={icon} alt="" className={styles.iconImage} />
            )}
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
      {(onAcceptButtonClick || onDenyButtonClick) && (
        <div className={styles.buttons}>
          {onAcceptButtonClick && (
            <Button
              handleClick={onAcceptButtonClick}
              className="red_button"
              content={acceptButtonText}
            />
          )}
          {onDenyButtonClick && (
            <Button
              handleClick={onDenyButtonClick}
              className="red_button_transparant"
              content={denyButtonText}
            />
          )}
        </div>
      )}
    </div>
  );
};

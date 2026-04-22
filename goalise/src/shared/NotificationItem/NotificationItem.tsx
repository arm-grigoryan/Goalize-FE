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
  outcome,
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
      {!onAcceptButtonClick && !onDenyButtonClick && outcome && (
        <div
          className={`${styles.outcome} ${
            outcome.type === "accepted" ? styles.outcomeAccepted : styles.outcomeDeclined
          }`}
        >
          {outcome.type === "accepted" ? (
            <svg
              className={styles.outcomeIcon}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M1.5 7.5L5.5 11.5L12.5 2.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className={styles.outcomeIcon}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span>{outcome.text}</span>
        </div>
      )}
    </div>
  );
};

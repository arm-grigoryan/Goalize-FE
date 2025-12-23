import React from "react";
import Button from "../Button";
import { INotificationItemProps } from "./NotificationItem.types";
import styles from './NotificationItem.module.css';
import Image from "next/image";

export const NotificationItem:React.FC<INotificationItemProps> = ({
    icon,
    title,
    description,
    acceptButtonText,
    denyButtonText,
    onAcceptButtonClick,
    onDenyButtonClick,
}) => {
    return <div className={styles.container}>
                <div className={styles.info}> 
                   {icon &&  <div className={styles.icon}>
                        <Image src={icon} alt="" /> 
                    </div>}
                    <div className={styles.content}>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.description}>{description}</div>
                    </div>
                </div>
                {(onAcceptButtonClick || onDenyButtonClick) && 
                <div className={styles.buttons}>
                    {onAcceptButtonClick && <Button handleClick={onAcceptButtonClick}  className="red_button" content={acceptButtonText}/>}
                    {onDenyButtonClick && <Button handleClick={onDenyButtonClick} className="red_button_transparant" content={denyButtonText} />}
                </div> 
                }
            </div>
};
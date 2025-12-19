import React from "react";
import Button from "../Button";
import { INotificationItemProps } from "./NotificationItem.types";

export const NotificationItem:React.FC<INotificationItemProps> = ({
    type,
    status,
    detail,
    instance,
    onAcceptButtonClick,
    onDenieButtonClick,
}) => {
    return <div>
                <div></div>
                <div>
                    <div></div>
                    <div></div>
                </div>
                <div>
                    {onAcceptButtonClick && <Button handleClick={onAcceptButtonClick}  className="" />}
                    {onDenieButtonClick && <Button handleClick={onDenieButtonClick} className="" />}
                </div>
            </div>
};
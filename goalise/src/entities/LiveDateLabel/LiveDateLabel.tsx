"use client";
import React from "react";
import styles from './LIveDateLabel.module.css';
import Image from "next/image";
import liveIcon from '../../assets/pngs/liveIcon.svg';
import redCalendarIcon from '../../assets/pngs/redCalendar.svg';
import redClock from '../../assets/pngs/redClock.svg';
import { useTranslations } from "next-intl";
export interface ILiveDateLabelProps {
    isLive?: boolean;
    date?: string;
    time?: string;
}
export const LiveDateLabel: React.FC<ILiveDateLabelProps> = ({
    isLive,
    date,
    time
}) => {
    const t = useTranslations("matches");
    return <>{isLive &&
        <div className={styles.container}>

        <div className={styles.liveWrapper}>
            <Image src={liveIcon} alt="" className={styles.liveIcon} />
            <div className={styles.liveText}>{t("liveLabel")}</div>
        </div>
    </div>}
        {(date || time) && 
        <div className={styles.dateWrapper}> 
            <Image src={redCalendarIcon} alt="" className={styles.dateIcon}/>
            <div>{date}</div>
            <Image src={redClock} alt="" className={styles.clockIcon}/>
            <div> {time} </div>
        </div>}
    </>
}
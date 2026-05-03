import React from "react";
import styles from './EventsPlayersInnerCard.module.css';
import Image, { StaticImageData } from "next/image";
import userLogo from '../../assets/pngs/userLogo.svg';
import phoneLogo from '../../assets/pngs/phoneLogo.svg';

export interface IEventsPlayersInnerCardProps {
    playerLogo?: StaticImageData;
    playerName?: string;
    phoneNumber?: string;
    isHost?: boolean;
}
export const EventsPlayersInnerCard: React.FC<IEventsPlayersInnerCardProps>= ({
    playerLogo,
    playerName,
    phoneNumber,
    isHost
}) => {
    return <div className={styles.container}>
        <div className={styles.playerInfoWrapper}>
            {playerLogo && <Image alt="" src={playerLogo} className={styles.playerLogo}/>}
            <div className={styles.playerName}>{playerName}</div>
            <div className={styles.youButton}>
                <Image src={userLogo} alt="" />
                <div>You</div>
            </div>
        </div>
        <div className={styles.phoneNumberWrapper}>
            <div className={`${styles.phoneNumber} ${isHost ? styles.host : ''}`}>{phoneNumber}</div>
            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                <Image src={phoneLogo} alt="" className={styles.icon} />
            </div>
        </div>
    </div>
};


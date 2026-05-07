'use client'
import React from "react";
import styles from './EventsPlayersInnerCard.module.css';
import Image from "next/image";
import userLogo from '../../assets/pngs/userLogo.svg';
import phoneLogo from '../../assets/pngs/phoneLogo.svg';
import profilePictureFallback from '../../assets/pngs/profilePictureIcon.svg';
import Link from "next/link";

const DUMMY_PHONE = '+37400000000';

const isValidUrl = (url: string): boolean => {
  try { new URL(url); return true; } catch { return false; }
};

export interface IEventsPlayersInnerCardProps {
  profilePic?: string | null;
  playerName?: string;
  phoneNumber?: string | null;
  isYou?: boolean;
  isHost?: boolean;
  playerId?: number;
}

export const EventsPlayersInnerCard: React.FC<IEventsPlayersInnerCardProps> = ({
  profilePic,
  playerName,
  phoneNumber,
  isYou,
  isHost,
  playerId,
}) => {
  const resolvedPic = profilePic && isValidUrl(profilePic) ? profilePic : profilePictureFallback;
  const isBlurred = phoneNumber === null || phoneNumber === undefined;

  const card = (
    <div className={styles.container}>
      <div className={styles.playerInfoWrapper}>
        <div className={styles.imageContainer}>
          <Image
            alt=""
            src={resolvedPic}
            className={styles.playerLogo}
            width={40}
            height={40}
            unoptimized={typeof resolvedPic === 'string'}
          />
          {isHost && <div className={styles.hostLabel}>Host</div>}
        </div>
        <div className={styles.playerName}>{playerName}</div>
        {isYou && (
          <div className={styles.youButton}>
            <Image src={userLogo} alt="" />
            <div>You</div>
          </div>
        )}
      </div>
      <div className={styles.phoneNumberWrapper}>
        <div className={`${styles.phoneNumber} ${isBlurred ? styles.blurred : ''}`}>
          {isBlurred ? DUMMY_PHONE : phoneNumber}
        </div>
        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
          <Image src={phoneLogo} alt="" className={styles.icon} />
        </div>
      </div>
    </div>
  );

  if (playerId) {
    return <Link href={`/profile/${playerId}`} style={{ textDecoration: 'none' }}>{card}</Link>;
  }
  return card;
};

'use client'
import React from "react";
import styles from './SquadCard.module.css';
import Image from "next/image";
import dots from '../../assets/pngs/dots.svg';
import Link from "next/link";
import profilePictureFallback from '../../assets/pngs/profilePictureIcon.svg';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export interface ISquadCardProps {
  playerName: string;
  shirtNumber: number;
  picture: string | null;
  playerId: number;
}

export const SquadCard: React.FC<ISquadCardProps> = ({
  playerName,
  shirtNumber,
  picture,
  playerId,
}) => {
  const resolvedPicture =
    picture && isValidUrl(picture) ? picture : profilePictureFallback;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.nameNumberContainer}>
          <Link href={`/profile/${playerId}`}>
            <Image
              src={resolvedPicture}
              alt={playerName}
              width={94}
              height={124}
              unoptimized
              className={styles.image}
            />
          </Link>
          <div className={styles.playerNumberContainer}>
            <div className={styles.playerNumber}>{shirtNumber}</div>
          </div>
        </div>
        <Link href={`/profile/${playerId}`} className={styles.teamName}>
          {playerName}
        </Link>
        <Image src={dots} alt="" className={styles.more} />
      </div>
    </div>
  );
};

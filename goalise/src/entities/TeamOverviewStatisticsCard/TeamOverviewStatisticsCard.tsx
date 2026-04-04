import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from './TeamOverviewStatisticsCard.module.css';
import CustomDivider from "@/shared/Divider";
import profilePictureFallback from '../../assets/pngs/noPhoto.png';

export interface ITeamOverviewStatisticsCardProps {
  title: string;
  playerName: string;
  playerPictureUrl: string | null;
  playerId: number | null;
  value: number | string;
}

export const TeamOverviewStatisticsCard: React.FC<ITeamOverviewStatisticsCardProps> = ({
  title,
  playerName,
  playerPictureUrl,
  playerId,
  value,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.logoNameWrapper}>
        {playerId ? (
          <Link href={`/profile/${playerId}`} className={styles.imageLink}>
            <Image
              src={playerPictureUrl || profilePictureFallback}
              alt={playerName}
              width={44}
              height={44}
              className={styles.playerImage}
              unoptimized
            />
          </Link>
        ) : (
          <Image
            src={profilePictureFallback}
            alt=""
            width={44}
            height={44}
            className={styles.playerImage}
          />
        )}
        <div className={styles.texts}>
          <div className={styles.subTitle}>{title}</div>
          {playerId ? (
            <Link href={`/profile/${playerId}`} className={styles.nameLink}>
              <div className={styles.name}>{playerName}</div>
            </Link>
          ) : (
            <div className={styles.name}>{playerName}</div>
          )}
        </div>
      </div>
      <CustomDivider orientation="vertical" variant="middle" flexItem />
      <div className={styles.number}>{value}</div>
    </div>
  );
};

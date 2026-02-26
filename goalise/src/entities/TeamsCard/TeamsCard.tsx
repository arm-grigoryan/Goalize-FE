'use client'
import React from "react";
import styles from './TeamsCard.module.css';
import Image from "next/image";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { ITeamListItem } from "@/types/api/temas";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";

export interface ITeamsCardProps {
  item: ITeamListItem;
}

export const TeamsCard: React.FC<ITeamsCardProps> = ({ item }) => {
  const { team, captain, matchDate, matchId, opponent } = item;
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const formattedDate = matchId !== null ? formatUTCDate(matchDate) : "-";

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.logoNameWrapper}>
        <Link href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
          <Image
            src={teamLogoFallback}
            alt={team.name}
            className={styles.logo}
          />
        </Link>
        <div className={styles.nameWrapper}>
          Captain:
          <Link href={`/profile/${team.captainId}`} style={{ textDecoration: 'none' }}>
            <span>{captain.firstName} {captain.lastName}</span>
          </Link>
        </div>
      </div>
      <div className={styles.titleBoxWrapper}>
        <Link href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
          <div className={styles.titleWrapper}>{team.name}</div>
        </Link>
        <div className={styles.boxesContainer}>
          <div className={styles.box}>
            Next Match:
            {matchId !== null ? (
              <Link href={`/matches/${matchId}`} style={{ textDecoration: 'none' }}>
                <span>{formattedDate}</span>
              </Link>
            ) : (
              <span className={styles.noData}>-</span>
            )}
          </div>
          <div className={styles.box}>
            Opponent:
            {opponent !== null ? (
              <Link href={`/teams/${opponent.id}`} style={{ textDecoration: 'none' }}>
                <span>{opponent.name}</span>
              </Link>
            ) : (
              <span className={styles.noData}>-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

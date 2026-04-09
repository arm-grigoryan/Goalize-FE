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
  onNextMatchClick?: () => void;
}

export const TeamsCard: React.FC<ITeamsCardProps> = ({ item, onNextMatchClick }) => {
  const { team, captain, matchDate, matchId, opponent } = item;
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const formattedDate = matchId !== null ? formatUTCDate(matchDate) : "-";

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.logoNameWrapper}>
        <Link href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
          <Image
            src={team.logoUrl && team.logoUrl.startsWith("http") ? team.logoUrl : teamLogoFallback}
            alt={team.name}
            className={styles.logo}
            width={106}
            height={106}
            unoptimized={!!(team.logoUrl && team.logoUrl.startsWith("http"))}
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
          <div className={`${styles.box} ${styles.nextMatch}`} onClick={onNextMatchClick}>
            <Link href={'#'}> Next Match: </Link>
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

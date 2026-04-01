"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import styles from "./TeamOverviewTrophiesCard.module.css";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import goldTrophie from "../../assets/pngs/goldenTrophy.svg";
import silverTrophie from "../../assets/pngs/silverTrophie.svg";
import bronze from "../../assets/pngs/bronzeTrophie.svg";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface ITeamOverviewTrophiesCardProps {
  leagueId: number;
  leagueName: string;
  leagueLogoUrl: string;
  season: string;
  type: "gold" | "silver" | "bronze";
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const trophyImage = {
  gold: goldTrophie,
  silver: silverTrophie,
  bronze: bronze,
};

export const TeamOverviewTrophiesCard: React.FC<
  ITeamOverviewTrophiesCardProps
> = ({ leagueId, leagueName, leagueLogoUrl, season, type }) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mobile : ""}`}
    >
      <div className={styles.logoNameWrapper}>
        <Link
          href={`/leagues/${leagueId}`}
          style={{ textDecoration: "none" }}
        >
          <Image
            src={
              leagueLogoUrl && isValidUrl(leagueLogoUrl)
                ? leagueLogoUrl
                : teamLogoFallback
            }
            alt={leagueName}
            width={36}
            height={36}
            unoptimized
            className={styles.leagueLogo}
          />
        </Link>
        <Link
          href={`/leagues/${leagueId}`}
          style={{ textDecoration: "none" }}
        >
          <div className={styles.name}>{leagueName}</div>
          <div className={styles.place}> {type === goldTrophie ? '1st Place' : type === bronze ? '2nd Place' : 'Semifinalist'}</div>
        </Link>
        <div className={styles.season}>{season}</div>
      </div>
      <Image
        src={trophyImage[type]}
        alt={type}
        className={styles.trophie}
      />
    </div>
  );
};

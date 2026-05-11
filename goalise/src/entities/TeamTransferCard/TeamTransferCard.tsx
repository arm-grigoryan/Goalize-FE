'use client'
import Image, { StaticImageData } from "next/image";
import React from "react";
import styles from './TeamTransferCard.module.css';
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import CustomDivider from "@/shared/Divider";
import left from '../../assets/pngs/left.svg';
import out from '../../assets/pngs/out.svg';
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import profilePictureFallback from '../../assets/pngs/profilePictureIcon.svg';
import teamLogoFallback from '../../assets/pngs/teamLogo.png';
import { useTranslations } from "next-intl";

export interface ITeamTransferCardProps {
  date: string;
  teamLogo: string | StaticImageData | null;
  teamName: string;
  teamNameTooltip?: string;
  teamId?: number;
  playerName?: string;
  playerLogo?: string | StaticImageData | null;
  playerId?: number;
  playerIn?: boolean;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const TeamTransferCard: React.FC<ITeamTransferCardProps> = ({
  date,
  teamLogo,
  teamName,
  teamNameTooltip,
  teamId,
  playerName,
  playerLogo,
  playerId,
  playerIn,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("teamTransfer.card");

  const resolvedPlayerLogo =
    playerLogo && typeof playerLogo === 'string' && isValidUrl(playerLogo)
      ? playerLogo
      : typeof playerLogo === 'object' && playerLogo !== null
      ? playerLogo
      : profilePictureFallback;

  const resolvedTeamLogo =
    teamLogo && typeof teamLogo === 'string' && isValidUrl(teamLogo)
      ? teamLogo
      : typeof teamLogo === 'object' && teamLogo !== null
      ? teamLogo
      : teamLogoFallback;

  const playerHref = playerId ? `/profile/${playerId}` : '#';
  const teamHref = teamId ? `/teams/${teamId}` : '#';
  const isFreeAgent = teamName?.toLowerCase() === 'free agent';

  return (
    <div className={`${styles.card} ${isMobile ? styles.mobile : ''}`}>
      <div>
        {!isMobile && (
          <div className={styles.date}>
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
              <Image src={calendarIcon} alt="" className={styles.icon} />
            </div>
            {date}
          </div>
        )}
      </div>
      {!isMobile && <CustomDivider flexItem orientation="vertical" />}
      <div className={styles.playerWrapper}>
        <Link href={playerHref}>
          <Image
            src={resolvedPlayerLogo}
            alt={playerName ?? ''}
            width={44}
            height={44}
            unoptimized
            className={styles.playerImage}
          />
        </Link>
        <div className={styles.playerNameWrapper}>
          <span>{t("playerName")}</span>
          <Link className={styles.playerName} href={playerHref}>
            {playerName}
          </Link>
        </div>
      </div>
      <div className={`${playerIn ? styles.infoWrapperBlue : styles.infoWrapperRed}`}>
        <div className={styles.inOutButton}>
          <Image src={playerIn ? left : out} alt="" className={styles.inOutIcon} />
          <div>
            {playerIn && !isMobile
              ? t("playerIn")
              : !playerIn && !isMobile
              ? t("playerOut")
              : playerIn
              ? t("in")
              : t("out")}
          </div>
        </div>
        <div className={styles.teamWrapper}>
          {isFreeAgent ? (
            <Image
              src={resolvedTeamLogo}
              alt={teamName}
              width={32}
              height={32}
              unoptimized
            />
          ) : (
            <Link href={teamHref}>
              <Image
                src={resolvedTeamLogo}
                alt={teamName}
                width={32}
                height={32}
                unoptimized
              />
            </Link>
          )}
          {isFreeAgent ? (
            <span className={styles.teamName} title={teamNameTooltip}>
              {teamName}
            </span>
          ) : (
            <Link className={styles.teamName} href={teamHref} title={teamNameTooltip}>
              {teamName}
            </Link>
          )}
        </div>
      </div>
      <div className={styles.dateWrapper}>
        {isMobile && (
          <div className={styles.date}>
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
              <Image src={calendarIcon} alt="" className={styles.icon} />
            </div>
            {date}
          </div>
        )}
      </div>
    </div>
  );
};

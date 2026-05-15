"use client";
import styles from "./TransferInnerCard.module.css";
import type { FC } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import transferIcon from "../../assets/pngs/transferIcon.png";
import { CustomDivider } from "@/shared/Divider/Divider";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

const isValidImageSrc = (src: string | StaticImageData | null | undefined): boolean => {
  if (!src || typeof src !== "string") return typeof src === "object" && src !== null;
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/");
};

interface TransferInnerCardProps {
  playerImage?: string | StaticImageData | null;
  playerId?: number;
  PlayerName: string;
  transferDate: string;
  teamLogoFrom?: string | StaticImageData;
  teamNameFrom: string;
  teamNameFromTooltip: string;
  fromTeamId?: number;
  teamLogoTo?: string | StaticImageData;
  teamNameTo: string;
  teamNameToTooltip: string;
  toTeamId?: number;
}

export const TransferInnerCard: FC<TransferInnerCardProps> = ({
  playerImage,
  playerId,
  PlayerName,
  transferDate,
  teamLogoFrom,
  teamNameFromTooltip,
  teamNameFrom,
  fromTeamId,
  teamLogoTo,
  teamNameTo,
  teamNameToTooltip,
  toTeamId,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const playerContent = (
    <div className={styles.player_info_wrapper}>
      {isValidImageSrc(playerImage) && (
        <Image src={playerImage!} alt="" width={40} height={40} />
      )}
      <div className={styles.player_info_and_date}>
        <span className={styles.player_name}>{PlayerName}</span>
        <span>{transferDate}</span>
      </div>
    </div>
  );

  const fromTeamContent = (
    <div className={styles.team_info}>
      {isValidImageSrc(teamLogoFrom) && (
        <Image src={teamLogoFrom!} alt="" width={20} height={20} className={styles.teamLogo} />
      )}
      <span title={teamNameFromTooltip} className={styles.first_info_name}>{teamNameFrom}</span>
    </div>
  );

  const toTeamContent = (
    <div className={styles.team_info}>
      {isValidImageSrc(teamLogoTo) && (
        <Image src={teamLogoTo!} alt="" width={20} height={20} className={styles.teamLogo} />
      )}
      <span title={teamNameToTooltip} className={styles.team_name}>{teamNameTo}</span>
    </div>
  );

  return (
    <div className={` ${styles.transfer_inner_card} ${isMobile ? styles.mobile : ""} `}>
      {playerId ? (
        <Link href={`/profile/${playerId}`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
          {playerContent}
        </Link>
      ) : playerContent}
      <CustomDivider variant="middle" orientation="vertical" flexItem />
      <div className={styles.transfer_info_wrapper}>
        <Image src={transferIcon} alt="" className={styles.transferLogo}/>
        <div className={styles.teams_info_inner_wrapper}>
          {fromTeamId ? (
            <Link href={`/teams/${fromTeamId}`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              {fromTeamContent}
            </Link>
          ) : fromTeamContent}
          {toTeamId ? (
            <Link href={`/teams/${toTeamId}`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              {toTeamContent}
            </Link>
          ) : toTeamContent}
        </div>
      </div>
    </div>
  );
};

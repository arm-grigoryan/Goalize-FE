"use client";
import styles from "./TransferInnerCard.module.css";
import type { FC } from "react";
import Image, { StaticImageData } from "next/image";
import transferIcon from "../../assets/pngs/transferIcon.png";
import { CustomDivider } from "@/shared/Divider/Divider";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

interface TransferInnerCardProps {
  playerImage: string | StaticImageData;
  PlayerName: string;
  transferDate: string;
  teamLogoFrom: string | StaticImageData;
  teamNameFrom: string;
  teamNameFromTooltip: string;
  teamLogoTo: string | StaticImageData;
  teamNameTo: string;
  teamNameToTooltip: string;
}

export const TransferInnerCard: FC<TransferInnerCardProps> = ({
  playerImage,
  PlayerName,
  transferDate,
  teamLogoFrom,
  teamNameFromTooltip,
  teamNameFrom,
  teamLogoTo,
  teamNameTo,
  teamNameToTooltip,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={` ${styles.transfer_inner_card} ${isMobile ? styles.mobile : ""} `}>
      <div className={styles.player_info_wrapper}>
        <Image src={playerImage} alt="" />
        <div className={styles.player_info_and_date}>
          <span>{PlayerName}</span>
          <span>{transferDate}</span>
        </div>
      </div>
      <CustomDivider variant="middle" orientation="vertical" flexItem />
      <div className={styles.transfer_info_wrapper}>
        <Image src={transferIcon} alt="" className={styles.transferLogo}/>
        <div className={styles.teams_info_inner_wrapper}>
          <div className={styles.team_info}>
            <Image src={teamLogoFrom} alt="" width={20} height={20} className={styles.teamLogo} />
            <span title={teamNameFromTooltip} className={styles.first_info_name}>{teamNameFrom}</span>
          </div>
          <div className={styles.team_info}>
            <Image src={teamLogoTo} alt="" width={20} height={20} className={styles.teamLogo} />
            <span title={teamNameToTooltip}>{teamNameTo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

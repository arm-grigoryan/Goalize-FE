"use client";
import styles from "./TransferInnerCard.module.css";
import type { FC } from "react";
import Image, { StaticImageData } from "next/image";
import transferIcon from "../../assets/pngs/transferIcon.png";
import { CustomDivider } from "@/shared/Divider/Divider";

interface TransferInnerCardProps {
  playerImage: string | StaticImageData;
  PlayerName: string;
  transferDate: string;
  teamLogoFrom: string | StaticImageData;
  teamNameFrom: string;
  teamLogoTo: string | StaticImageData;
  teamNameTo: string;
}

export const TransferInnerCard: FC<TransferInnerCardProps> = ({
  playerImage,
  PlayerName,
  transferDate,
  teamLogoFrom,
  teamNameFrom,
  teamLogoTo,
  teamNameTo,
}) => {
  return (
    <div className={styles.transfer_inner_card}>
      <div className={styles.player_info_wrapper}>
        <Image src={playerImage} alt="" />
        <div className={styles.player_info_and_date}>
          <span>{PlayerName}</span>
          <span>{transferDate}</span>
        </div>
      </div>
      <CustomDivider variant="middle" orientation="vertical" flexItem />
      <div className={styles.transfer_info_wrapper}>
        <Image src={transferIcon} alt="" />
        <div>
          <div>
            <Image src={teamLogoFrom} alt="" width={20} height={20} />
            <span>{teamNameFrom}</span>
          </div>
          <div>
            <Image src={teamLogoTo} alt="" width={20} height={20} />
            <span>{teamNameTo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

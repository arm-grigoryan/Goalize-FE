"use client";
import type { FC } from "react";
import type { StaticImageData } from "next/image";
import styles from "./PastMatchesInnerCard.module.css";
import Image from "next/image";
import emptyCalendar from "../../assets/pngs/calendarIconEmpty.png";
import { CustomDivider } from "@/shared/Divider/Divider";
interface PastMatchesInnerCardProps {
  date: string;
  winnerIcon: string | StaticImageData;
  drawIcon: string | StaticImageData;
  teamLogo1: string | StaticImageData;
  teamName1: string;
  teamScore1: number;
  teamLogo2: string | StaticImageData;
  teamName2: string;
  teamScore2: number;
}

export const PastMatchesInnerCard: FC<PastMatchesInnerCardProps> = ({
  date,
  winnerIcon,
  drawIcon,
  teamLogo1,
  teamName1,
  teamLogo2,
  teamName2,
  teamScore1,
  teamScore2,
}) => {
  const winner1 = teamScore1 > teamScore2;
  const winner2 = teamScore2 > teamScore1;
  const draw = teamScore1 === teamScore2;

  return (
    <div className={styles.past_matches_innerCard}>
      <Image src={emptyCalendar} alt="" />
      <div className={styles.date}>{date}</div>
      <CustomDivider variant="middle" orientation="vertical" flexItem />

      <div className={styles.winner_wrapper}>
        {winner1 && <Image src={winnerIcon} alt="" />}
        {draw && <Image src={drawIcon} alt="" />}
      </div>
      <div className={styles.team_info}>
        <div className={styles.team_logo}>
          {<Image src={teamLogo1} alt="" />}
        </div>
        <div className={styles.team_name}>{teamName1}</div>
        <div className={styles.score_wrapper}>
          <div>{teamScore1}</div>
          <CustomDivider orientation="vertical" flexItem />
          <div>{teamScore2}</div>
        </div>
        <div>{teamName2}</div>
        <div>{<Image src={teamLogo2} alt="" />}</div>
      </div>
      <div className={styles.winner_wrapper}>
        {winner2 && <Image src={winnerIcon} alt="" />}
        {draw && <Image src={drawIcon} alt="" />}
      </div>
    </div>
  );
};

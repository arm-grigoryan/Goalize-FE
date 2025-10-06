"use client";
import { FC } from "react";
import styles from "./MatchListInnerCard.module.css";
import Image from "next/image";
import calendarEmpty from "../../assets/pngs/calendarIconEmpty.png";
import clockIcon from "../../assets/pngs/clockIconRed.png";
import CustomDivider from "@/shared/Divider";
import vsIcon from "../../assets/pngs/vsIconRedSmall.png";

interface MatchListInnerCardProps {
  teamNameHome: string;
  homeTeamPoints: number;
  teamNameAway: string;
  awayTeamPoints: number;
  matchDate: string;
  matchTime: string;
}

export const MatchListInnerCard: FC<MatchListInnerCardProps> = ({
  teamNameHome,
  homeTeamPoints,
  teamNameAway,
  awayTeamPoints,
  matchDate,
  matchTime,
}) => {
  return (
    <div className={styles.match_list_innerCard}>
      <div className={styles.teams_info}>
        <div className={styles.team_inner_info}>
          <div className={styles.team_name}>{teamNameHome}</div>
          <div className={styles.team_points}>{`${homeTeamPoints} pts`}</div>
        </div>
        <div className={styles.vs_icon}>
          <Image src={vsIcon} alt="" />
        </div>
        <CustomDivider orientation="horizontal" />
        <div className={styles.team_inner_info}>
          <div className={styles.team_name}>{teamNameAway}</div>
          <div className={styles.team_points}>{`${awayTeamPoints} pts`}</div>
        </div>
      </div>
      <CustomDivider orientation="vertical" />
      <div className={styles.match_date_time}>
        <Image src={calendarEmpty} alt="" />
        <div>{matchDate}</div>
        <Image src={clockIcon} alt="" />
        <div>{matchTime}</div>
      </div>
    </div>
  );
};

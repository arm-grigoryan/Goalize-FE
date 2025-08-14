"use client";
import { FC } from "react";
import styles from "./MatchListInnerCard.module.css";
import Image from "next/image";
import calendarEmpty from "../../assets/pngs/calendarIconEmpty.png";
import clockIcon from "../../assets/pngs/clockIconRed.png";

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
      <div>
        <div>
          <div className={styles.team_name}>{teamNameHome}</div>
          <div>{homeTeamPoints}</div>
        </div>
        <div>
          <div className={styles.team_name}>{teamNameAway}</div>
          <div>{awayTeamPoints}</div>
        </div>
      </div>
      <div>
        <div>2nd match</div>
        <Image src={calendarEmpty} alt="" />
        <div>{matchDate}</div>
        <Image src={clockIcon} alt="" />
        <div>{matchTime}</div>
      </div>
    </div>
  );
};

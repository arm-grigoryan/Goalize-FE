"use client";
import { FC } from "react";
import styles from "./MatchListInnerCard.module.css";
import Image from "next/image";
import CustomDivider from "@/shared/Divider";
import vsIcon from "../../assets/pngs/vsIcon.svg";
import redCalendar from '../../assets/pngs/redCalendar.svg';
import redClock from '../../assets/pngs/redClock.svg';
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
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
   const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={` ${styles.match_list_innerCard} ${isMobile ? styles.mobile : ""} `}>
      <div className={styles.teams_info}>
        <div className={styles.team_inner_info}>
          <div className={styles.team_name}>{teamNameHome}</div>
          <div className={styles.team_points}> 
            {homeTeamPoints !== null && 
           `${homeTeamPoints} pts`}
          </div>
        </div>
        <div className={styles.vs_icon}>
          <Image src={vsIcon} alt="" />
        </div>
        <CustomDivider orientation="horizontal" />
        <div className={styles.team_inner_info}>
          <div className={styles.team_name}>{teamNameAway}</div>
          <div className={styles.team_points}>
            {awayTeamPoints !== null && 
            `${awayTeamPoints} pts`
          }</div>
        </div>
      </div>
      <div className={styles.divider}> 
        <CustomDivider orientation="vertical" />
      </div>
      <div className={styles.match_date_time}>
        <Image src={redCalendar} alt="" className={styles.icon}/>
        <div className={styles.date}>{matchDate}</div>
        <Image src={redClock} alt=""  className={styles.iconTime} />
        <div className={styles.time}>{matchTime}</div>
      </div>
    </div>
  );
};

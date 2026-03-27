"use client"
import React from "react";
import styles from './TeamsPastMatchesCard.module.css';
import Image, { StaticImageData } from "next/image";
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import CustomDivider from "@/shared/Divider";
import drawIcon from '../../assets/pngs/drawIcon.svg';
import winnerIcon from '../../assets/pngs/winnerIcon.svg';
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import winnerIconSwapped from '../../assets/pngs/winnerIconSwapped.svg';
import drawSwappedIcon from '../../assets/pngs/drawIconSwapped.svg';
import vsIcon from '../../assets/pngs/bigVsIcon.svg';
import Link from "next/link";

type TeamsPastMatchesVariants = "results" | "fixtures";

export interface ITeamsPastMatchesCardProps {
 variant?: TeamsPastMatchesVariants;
  date: string;
  teamLogo1: string | StaticImageData;
  teamName1: string;
  teamName1Tooltip?: string;
  teamScore1: number;
  teamLogo2: string | StaticImageData;
  teamName2: string;
  teamName2Tooltip?: string;
  teamScore2: number;
  leagueName?: string;
  leagueId?: number;
  onCardClick?: () => void;
}

export const TeamsPastMatchesCard: React.FC<ITeamsPastMatchesCardProps> = ({
    date,
    teamLogo1,
    teamName1,
    teamName1Tooltip,
    teamScore1,
    teamLogo2,
    teamName2,
    teamName2Tooltip,
    teamScore2,
    variant,
    leagueName,
    leagueId,
    onCardClick
}) => {
      const { width } = useWindowSize();
      const isMobile = width <= MEDIA_TABLET_SMALL;
    
      const winner1 = teamScore1 > teamScore2;
      const winner2 = teamScore2 > teamScore1;
      const draw = teamScore1 === teamScore2;
      
    return <div className={`${variant === "fixtures" ? 
                                styles.matches_innerCard_fixtures 
                                : styles.matches_innerCard} 
                            ${isMobile ? styles.mobile : ''}`}
                            onClick={onCardClick}>
      <div className={styles.date}>
        <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
          <Image src={calendarIcon} alt="" className={styles.icon} />
        </div>
        {date}
      </div>
      {!isMobile && <CustomDivider orientation="vertical" flexItem />}
      <div className={styles.wrapper}> 
      <div className={styles.side_left}>
        <div className={styles.winner_slot}>
          {winner1 && <Image src={winnerIconSwapped} alt=""  className={styles.winner1}/>}
          {draw  && !(variant === "fixtures") && <Image src={drawSwappedIcon} alt="" />}
        </div>

        <div className={styles.team}>
          <Image src={teamLogo1} alt="" width={36} height={36} unoptimized />
          <span className={styles.team_name} title={teamName1Tooltip}>
            {teamName1}
          </span>
        </div>
      </div>

      <div className={`${variant === "fixtures" ? styles.fixturesScoreWrapper : styles.score_wrapper}`}>
       {!(variant === "fixtures") &&
        <span className={`${variant == "results" &&
                            winner1 && styles.score1} 
                          ${styles.score}`}>
            {teamScore1}
        </span>} 
      {variant === "fixtures" 
            ? <Image src={vsIcon} alt="" className={styles.vsIcon} /> 
            : <CustomDivider orientation="vertical" flexItem />}
       {!(variant === "fixtures") && 
          <span className={`${variant == "results" &&
                              winner2 && styles.score2} 
                              ${styles.score}`}>
                {teamScore2}
            </span>}
      </div>

      <div className={styles.side_right}>
        <div className={styles.team}>
          <span className={styles.team_name} title={teamName2Tooltip}>
            {teamName2}
          </span>
          <Image src={teamLogo2} alt="" width={36} height={36} unoptimized />
        </div>

        <div className={styles.winner_slot2}>
          {winner2 && <Image src={winnerIcon} alt="" />}
          {draw && !(variant === "fixtures") && <Image src={drawIcon} alt="" />}
        </div>
      </div>
      </div>
        <CustomDivider orientation={isMobile ?  "horizontal" : "vertical"}flexItem />
        <Link className={styles.leagueName} href={leagueId ? `/leagues/${leagueId}` : '#'}>
          {leagueName ?? 'League'}
        </Link>
    </div>
}
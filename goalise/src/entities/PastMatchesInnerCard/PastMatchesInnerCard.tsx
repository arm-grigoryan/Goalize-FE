"use client";

import type { FC } from "react";
import type { StaticImageData } from "next/image";
import styles from "./PastMatchesInnerCard.module.css";
import Image from "next/image";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import vsIcon from "../../assets/pngs/vsIcon.png";
import winnerIconSwapped from "../../assets/pngs/winnerIconSwapped.svg";
import drawSwappedIcon from "../../assets/pngs/drawIconSwapped.svg";
import calendarIcon from "../../assets/pngs/dateIcon.svg";

type PatchMatchesInnerCardVariant = "default" | "results" | "fixtures";
interface PastMatchesInnerCardProps {
  variant?: PatchMatchesInnerCardVariant;
  date: string;
  winnerIcon: string | StaticImageData;
  drawIcon?: string | StaticImageData;
  teamLogo1: string | StaticImageData;
  teamName1: string;
  teamName1Tooltip?: string;
  teamScore1: number;
  teamLogo2: string | StaticImageData;
  teamName2: string;
  teamName2Tooltip?: string;
  teamScore2: number;
}

export const PastMatchesInnerCard: FC<PastMatchesInnerCardProps> = ({
  variant = "default",
  date,
  winnerIcon,
  drawIcon,
  teamLogo1,
  teamName1,
  teamName1Tooltip,
  teamScore1,
  teamLogo2,
  teamName2,
  teamName2Tooltip,
  teamScore2,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const winner1 = teamScore1 > teamScore2;
  const winner2 = teamScore2 > teamScore1;
  const draw = teamScore1 === teamScore2;

  if (isMobile) {
    return (
      <div className={`${variant == "results" ? 
                          styles.past_matches_innerCard_results_mobile
                          : variant == 'fixtures' ?
                          styles.past_matches_innerCard_fixtures_mobile
                          : styles.past_matches_innerCard_mobile}`}
        >
          <div className={styles.date_wrapper}>
            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
              <Image src={calendarIcon} alt="" />
            </div>
            <span>{date}</span>
        </div>
        <div className={styles.team_info_mobile}>
          <div className={styles.home_team_info_mobile}>
              <div className={styles.winner_wrapper_mobile}>
              {winner1 && <Image src={winnerIcon} alt="" className={styles.winnerIcon} />}
              {draw && drawIcon && <Image src={drawIcon} alt="" className={styles.drawIcon}/>}
            </div>
            <Image src={teamLogo1} alt="" className={styles.team_logo_mobile} />
            <div>{teamName1}</div>
          </div>

         <div className={styles.score_wrapper}>
            {!(variant === "fixtures" ) &&
              <span className={`${variant == "results" &&
                                  winner1 && styles.score1} 
                                ${styles.score}`}>
                  {teamScore1}
              </span>} 
            {variant === "fixtures" 
                  ? <Image src={vsIcon} alt="" className={styles.vsIcon} /> 
                  : <CustomDivider orientation="vertical" flexItem />}
            {!(variant === "fixtures" ) && 
                <span className={`${variant == "results" &&
                                    winner2 && styles.score2} 
                                    ${styles.score}`}>
                      {teamScore2}
                  </span>}
          </div>

          <div className={styles.away_team_info_mobile}>
              <div className={styles.winner_wrapper_mobile}>
              {winner2 && <Image src={winnerIconSwapped} alt="" className={styles.winnerIconSwapped} />}
              {draw && drawIcon && <Image src={drawSwappedIcon} alt="" className={styles.drawIconSwapped} />}
            </div>
            <Image src={teamLogo2} alt="" className={styles.team_logo_mobile} />
            <div>{teamName2}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variant == "results" ? 
                          styles.past_matches_innerCard_results
                          : variant === "fixtures" ? 
                          styles.past_matches_innerCard_fixtures 
                          :styles.past_matches_innerCard}`}>
      <div className={styles.date}>
        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
          <Image src={calendarIcon} alt="" className={styles.icon} />
        </div>
        {date}
      </div>
      <CustomDivider orientation="vertical" flexItem />
      <div className={styles.wrapper}> 
      <div className={styles.side_left}>
        <div className={styles.winner_slot}>
          {winner1 && <Image src={variant == "default" ? winnerIcon : winnerIconSwapped} alt="" />}
          {draw && drawIcon && <Image src={variant == "default" ? drawIcon : drawSwappedIcon} alt="" />}
        </div>

        <div className={styles.team}>
          <Image src={teamLogo1} alt="" />
          <span className={styles.team_name} title={teamName1Tooltip}>
            {teamName1}
          </span>
        </div>
      </div>

      <div className={styles.score_wrapper}>
       {!(variant === "fixtures" ) &&
        <span className={`${variant == "results" &&
                            winner1 && styles.score1} 
                          ${styles.score}`}>
            {teamScore1}
        </span>} 
      {variant === "fixtures" 
            ? <Image src={vsIcon} alt="" className={styles.vsIcon} /> 
            : <CustomDivider orientation="vertical" flexItem />}
       {!(variant === "fixtures" ) && 
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
          <Image src={teamLogo2} alt="" />
        </div>

        <div className={styles.winner_slot2}>
          {winner2 && <Image src={variant == "default" ? winnerIconSwapped : winnerIcon} alt="" />}
          {draw && <Image src={variant == "default" ? drawSwappedIcon : drawIcon} alt="" />}
        </div>
      </div>
      </div>
    </div>
  );
};

"use client";
import type { FC } from "react";
import type { StaticImageData } from "next/image";
import styles from "./PastMatchesInnerCard.module.css";
import Image from "next/image";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import winnerIconSwapped from '../../assets/pngs/winnerIconSwapped.svg';
import drawSwappedIcon from '../../assets/pngs/drawIconSwapped.svg'
import calendarIcon from '../../assets/pngs/dateIcon.svg'
interface PastMatchesInnerCardProps {
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
  isBig?: boolean;
}

export const PastMatchesInnerCard: FC<PastMatchesInnerCardProps> = ({
  date,
  winnerIcon,
  drawIcon,
  teamLogo1,
  teamName1,
  teamName1Tooltip,
  teamLogo2,
  teamName2,
  teamName2Tooltip,
  teamScore1,
  teamScore2,
  isBig = false,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const winner1 = teamScore1 > teamScore2;
  const winner2 = teamScore2 > teamScore1;
  const draw = teamScore1 === teamScore2;
  return (
    <>
      {isMobile ? (
        <div className={`${isMobile ? styles.mobile : ""} ${styles.past_matches_innerCard_mobile}`}>
          <div className={styles.date_wrapper}>
            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
            <Image
              src={calendarIcon}
              alt=""
              className={styles.empty_calendar}
            />
            </div>
            <div className={styles.date}>{date}</div>
          </div>
          <div className={styles.team_info_mobile}>
            <div className={styles.home_team_info_mobile}>
              <div
                className={
                  isBig
                    ? styles.winner_wrapper_big1
                    : styles.winner_wrapper_mobile
                }
              >
                {winner1 && <Image src={winnerIcon} alt="" />}
                {draw && drawIcon && <Image src={drawIcon} alt="" />}
              </div>
              <Image
                src={teamLogo1}
                alt=""
                className={styles.team_logo_mobile}
              />
              <div className={styles.team_name_mobile}>{teamName1}</div>
            </div>
            <div className={styles.score_wrapper_mobile}>
              {teamScore1 !== null && teamScore2 !== null ? (
                <>
                  <div>{teamScore1}</div>
                  <CustomDivider orientation="vertical" flexItem />
                  <div>{teamScore2}</div>
                </>
              ) : (
                <div>vs</div>
              )}
            </div>
            <div className={styles.away_team_info_mobile}>
              <div
                className={
                  isBig
                    ? styles.winner_wrapper_big2
                    : styles.winner_wrapper_mobile
                }
              >
                {winner2 && <Image src={winnerIcon} alt="" />}
                {draw && drawIcon && <Image src={drawIcon} alt="" />}
              </div>
              <Image
                src={teamLogo2}
                alt=""
                className={styles.team_logo_mobile}
              />
              <div>{teamName2}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.past_matches_innerCard} ${isMobile ? styles.mobile : ""}`}>
          <div className={styles.date}>
            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
              <Image src={calendarIcon} alt="" className={styles.icon} />
            </div>
            {date}
          </div>

          <div className={styles.side}>
            <div className={styles.winner_slot}>
              {winner1 && <Image src={winnerIcon} alt="" />}
              {draw && drawIcon && <Image src={drawIcon} alt="" />}
            </div>

            <div className={styles.team}>
              <Image src={teamLogo1} alt="" />
              <span className={styles.team_name} title={teamName1Tooltip}>
                {teamName1}
              </span>
            </div>
          </div>

          <div className={styles.score_wrapper}>
            <span>{teamScore1}</span>
            <CustomDivider orientation="vertical" flexItem />
            <span>{teamScore2}</span>
          </div>

          <div className={styles.side}>
            <div className={styles.team}>
              <span className={styles.team_name} title={teamName2Tooltip}>
                {teamName2}
              </span>
              <Image src={teamLogo2} alt="" />
            </div>

            <div className={styles.winner_slot2}>
              {winner2 && <Image src={winnerIconSwapped} alt="" />}
              {draw && <Image src={drawSwappedIcon} alt="" />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

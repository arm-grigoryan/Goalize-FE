"use client";
import type { FC } from "react";
import type { StaticImageData } from "next/image";
import styles from "./PastMatchesInnerCard.module.css";
import Image from "next/image";
import emptyCalendar from "../../assets/pngs/calendarIconEmpty.png";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
interface PastMatchesInnerCardProps {
  date: string;
  winnerIcon: string | StaticImageData;
  drawIcon?: string | StaticImageData;
  teamLogo1: string | StaticImageData;
  teamName1: string;
  teamScore1: number;
  teamLogo2: string | StaticImageData;
  teamName2: string;
  teamScore2: number;
  isBig?: boolean;
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
        <div className={styles.past_matches_innerCard_mobile}>
          <div className={styles.date_wrapper}>
            <Image
              src={emptyCalendar}
              alt=""
              className={styles.empty_calendar}
            />
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
        <div className={styles.past_matches_innerCard}>
          <Image src={emptyCalendar} alt="" />
          <div className={styles.date}>{date}</div>
          <CustomDivider variant="middle" orientation="vertical" flexItem />

          <div
            className={
              isBig ? styles.winner_wrapper_big1 : styles.winner_wrapper
            }
          >
            {winner1 && <Image src={winnerIcon} alt="" />}
            {draw && drawIcon && <Image src={drawIcon} alt="" />}
          </div>
          <div className={styles.team_info}>
            <div className={styles.team_logo}>
              {<Image src={teamLogo1} alt="" />}
            </div>
            <div className={styles.team_name}>{teamName1}</div>
            <div className={styles.score_wrapper}>
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
            <div className={styles.team_name}>{teamName2}</div>
            <div>{<Image src={teamLogo2} alt="" />}</div>
          </div>
          <div
            className={
              isBig ? styles.winner_wrapper_big2 : styles.winner_wrapper
            }
          >
            {winner2 && <Image src={winnerIcon} alt="" />}
            {draw && drawIcon && <Image src={drawIcon} alt="" />}
          </div>
        </div>
      )}
    </>
  );
};

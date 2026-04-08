"use client";
import React from "react";
import styles from "./TeamOverviewNextMatch.module.css";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import calendarIcon from "../../assets/pngs/calendarIcon.svg";
import vsIcon from "../../assets/pngs/bigVsIcon.svg";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useGetTeamNextMatchQuery } from "@/app/store/services/api";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { Loader } from "@/shared/Loader/Loader";
import { LiveDateLabel } from "@/entities/LiveDateLabel/LiveDateLabel";
import upcomingEmpty from '../../assets/pngs/upcomingEmpty.svg';
import matchMobileEmpty from '../../assets/pngs/matchMobileEmpty.svg';
import backgroundImageRight from '../../assets/pngs/backgroundImageRight.svg';
import backgroundImageLeft from '../../assets/pngs/backgroundImageLeft.svg';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const TeamOverviewNextMatch: React.FC = () => {
  const { teamId } = useParams();
  const id = Number(teamId);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: nextMatch, isLoading } = useGetTeamNextMatchQuery(id, {
    skip: !id,
  });

  const homeTeam = nextMatch?.homeTeam;
  const awayTeam = nextMatch?.awayTeam;

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.buttonTitleWrapper}>
        <div className={`${styles.redButton} ${styles.redGlow}`}>
          <Image src={calendarIcon} alt="" className={styles.calendarIcon} />
        </div>
        <div className={styles.title}>Next Match</div>
      </div>

      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : !nextMatch ? (
        <div className={styles.noMatch}>
          {!isMobile ? <Image src={upcomingEmpty} alt="" /> : <Image src={matchMobileEmpty} alt=" " />}
          <div>No match is scheduled at the moment</div>
        </div>
      ) : (
        <Link
          href={`/matches/${nextMatch.matchId}`}
          className={styles.matchWrapper}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div>
            {nextMatch.isLive ? (
              <LiveDateLabel isLive />
            ) : (() => {
              const isValidDate = nextMatch.matchDate && !isNaN(new Date(nextMatch.matchDate).getTime());
              return isValidDate
                ? <LiveDateLabel date={formatUTCDate(nextMatch.matchDate)} time={formatUTCDate(nextMatch.matchDate, "HH:MM")} />
                : <LiveDateLabel date="TBD" />;
            })()}
          </div>

          <div className={styles.teamsRow}>
            {/* Home team */}
            <div className={styles.match_left_block}>
               <div className={styles.backgroundImageWrapper}>  
                <Image 
                  src={backgroundImageLeft}
                  alt=""
                  className={styles.backgroundImage}
                /> 
                </div>
              <div className={styles.match_left_block_inner_wrapper}>
                <span className={styles.team_name}>{homeTeam?.name ?? ""}</span>
                <Image
                  src={
                    homeTeam?.logoUrl && isValidUrl(homeTeam.logoUrl)
                      ? homeTeam.logoUrl
                      : teamLogoFallback
                  }
                  alt={homeTeam?.name ?? "Home Team"}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
              </div>
            </div>

            {/* Center: VS + league */}
            <div className={styles.matchCenterCol}>
              <Image src={vsIcon} alt="vs" className={styles.vsIcon} />
              {nextMatch.league && (
                <div className={styles.leagueLink}>
                  {nextMatch.league.logoUrl &&
                    isValidUrl(nextMatch.league.logoUrl) && (
                      <Image
                        src={nextMatch.league.logoUrl}
                        alt={nextMatch.league.name}
                        width={18}
                        height={18}
                        unoptimized
                        className={styles.leagueLogo}
                      />
                    )}
                  <span className={styles.leagueName}>
                    {nextMatch.league.name}
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className={styles.match_right_block}>
               <div className={styles.backgroundImageWrapper}>  
                <Image 
                  src={backgroundImageRight}
                  alt=""
                  className={styles.backgroundImage}
                /> 
                </div>
              <div className={styles.match_right_block_inner_wrapper}>
                <Image
                  src={
                    awayTeam?.logoUrl && isValidUrl(awayTeam.logoUrl)
                      ? awayTeam.logoUrl
                      : teamLogoFallback
                  }
                  alt={awayTeam?.name ?? "Away Team"}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
                <span className={styles.team_name}>{awayTeam?.name ?? ""}</span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

"use client";
import React from "react";
import styles from "./TeamOverviewNextMatch.module.css";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import calendarIcon from "../../assets/pngs/calendarIcon.svg";
import vsIcon from "../../assets/pngs/bigVsIcon.svg";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useGetTeamNextMatchQuery } from "@/app/store/services/api";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { Loader } from "@/shared/Loader/Loader";

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
  const router = useRouter();

  const { data: nextMatch, isLoading } = useGetTeamNextMatchQuery(id, {
    skip: !id,
  });

  // Determine which side is the current team and which is the opponent
  const currentTeam =
    nextMatch?.homeTeam.id === id ? nextMatch.homeTeam : nextMatch?.awayTeam;
  const opponent =
    nextMatch?.homeTeam.id === id ? nextMatch?.awayTeam : nextMatch?.homeTeam;

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
        <div className={styles.noMatch}>No upcoming match</div>
      ) : (
        <div
          className={styles.matchWrapper}
          onClick={() => router.push(`/matches/${nextMatch.matchId}`)}
          role="link"
          tabIndex={0}
        >
          {/* Current team */}
          <div className={styles.match_left_block}>
            <div className={styles.match_left_block_inner_wrapper}>
              <span className={styles.team_name}>{currentTeam?.name ?? ""}</span>
              <Image
                src={
                  currentTeam?.logoUrl && isValidUrl(currentTeam.logoUrl)
                    ? currentTeam.logoUrl
                    : teamLogoFallback
                }
                alt={currentTeam?.name ?? "Team"}
                className={styles.team_logo}
                width={106}
                height={106}
                unoptimized
              />
            </div>
          </div>

          {/* Center: VS + date + league */}
          <div className={styles.matchCenterCol}>
            <Image src={vsIcon} alt="vs" className={styles.vsIcon} />
            <span className={styles.matchDate}>
              {formatUTCDate(nextMatch.matchDate, "dd/mm/yyyy")}
            </span>
            {nextMatch.league && (
              <Link
                href={`/leagues/${nextMatch.league.id}`}
                className={styles.leagueLink}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
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
              </Link>
            )}
          </div>

          {/* Opponent */}
          <div className={styles.match_right_block}>
            <div className={styles.match_right_block_inner_wrapper}>
              <Link
                href={`/teams/${opponent?.id}`}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={
                    opponent?.logoUrl && isValidUrl(opponent.logoUrl)
                      ? opponent.logoUrl
                      : teamLogoFallback
                  }
                  alt={opponent?.name ?? "Opponent"}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
              </Link>
              <Link
                href={`/teams/${opponent?.id}`}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.team_name}>{opponent?.name ?? ""}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

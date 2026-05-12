'use client'
import React, { useEffect } from "react";
import styles from './MatchesHeader.module.css';
import CustomDivider from "@/shared/Divider";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../Breadcrumb/Breadcrumb";
import { LiveDateLabel } from "../LiveDateLabel/LiveDateLabel";
import localFont from "next/font/local";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import winnerIcon from '../../assets/pngs/winnerIcon.svg';
import winnerIconSwappped from '../../assets/pngs/winnerIconSwapped.svg';
import vsIconBig from '../../assets/pngs/vsIcon.png';
import { useParams, useRouter } from "next/navigation";
import { useGetMatchByIdQuery } from "@/app/store/services/api";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import backgroundImageLeft from '../../assets/pngs/backgroundImageLeft.svg';
import backgroundImageRight from '../../assets/pngs/backgroundImageRight.svg';
import { useTranslations } from "next-intl";

const chopsic = localFont({
   src: "../../../src/app/fonts/chopsic/Chopsic.otf",
})

export const MatchesHeader: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { matchId } = useParams();
  const router = useRouter();
  const t = useTranslations("matches.header");

  const { data: match, isLoading, error } = useGetMatchByIdQuery(Number(matchId));

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      router.replace('/not-found');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
        <div className={styles.loaderWrapper}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!match) return null;

  const leagueHref = `/leagues/${match.matchPhase.league.id}`;
  const leagueName = match.matchPhase.league.name;

  const breadcrumbItems = (() => {
    const items: { label: string; href: string }[] = [{ label: leagueName, href: leagueHref }];
    if (match.matchPhase.playoff) {
      items.push(
        { label: t("playoff"), href: leagueHref },
        { label: match.matchPhase.playoff.name, href: leagueHref }
      );
    } else if (match.matchPhase.groupRound) {
      items.push(
        { label: t("groupStage"), href: leagueHref },
        { label: match.matchPhase.groupRound.round.name, href: leagueHref }
      );
    }
    return items;
  })();

  const homeIsWinner = match.state === "Finished" && match.homeTeamScore > match.awayTeamScore;
  const awayIsWinner = match.state === "Finished" && match.awayTeamScore > match.homeTeamScore;

  const formattedDate = formatUTCDate(match.date, "dd-mm-yyyy");
  const formattedTime = formatUTCDate(match.date, "HH:MM");
  const isTBA = formattedDate === "To-Be-Announced";

  const leagueLogoUrl = match.matchPhase.league.logoUrl?.startsWith('http')
    ? match.matchPhase.league.logoUrl
    : undefined;

  const homeLogoUrl = match.homeTeam.logoUrl?.startsWith('http')
    ? match.homeTeam.logoUrl
    : undefined;

  const awayLogoUrl = match.awayTeam.logoUrl?.startsWith('http')
    ? match.awayTeam.logoUrl
    : undefined;

  const renderScoreContent = () => (
    <div className={styles.scoreWrapper}>
      <div className={styles.scoreIconWRapper}>
        <div className={`${styles.score} ${chopsic.className}`}>{match.homeTeamScore}</div>
        {homeIsWinner && <Image src={winnerIcon} alt="" />}
      </div>
      <div className={`${styles.score} ${chopsic.className}`}>:</div>
      <div className={`${isMobile ? styles.scoreIconWRapperRight : styles.scoreIconWRapper}`}>
        <div className={`${styles.score} ${chopsic.className}`}>{match.awayTeamScore}</div>
        {awayIsWinner && <Image src={winnerIconSwappped} alt="" />}
      </div>
    </div>
  );

  const renderTopLabel = () => {
    if (match.state === "Upcoming") {
      return isTBA
        ? <LiveDateLabel date={t("tba")} time={t("tba")} />
        : <LiveDateLabel date={formattedDate} time={formattedTime} />;
    }
    if (match.state === "Live") {
      return <LiveDateLabel isLive />;
    }
    return <LiveDateLabel date={formattedDate} time={formattedTime} />;
  };

  const renderCenterCol = () => {
    if (match.state === "Upcoming") {
      return (
        <div className={styles.matchCenterCol}>
          <div className={styles.vsIconWrapper}> 
            <Image src={vsIconBig} alt="vs" className={styles.vsIcon} />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.matchCenterCol}>
        {renderScoreContent()}
      </div>
    );
  };

  return <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
    <div className={styles.leftPart}>
      <div className={styles.teamInfo}>
        {leagueLogoUrl && (
          <Image src={leagueLogoUrl} alt="League Logo" className={styles.teamLogo} width={92} height={92} unoptimized />
        )}
        {!isMobile && <Link href={leagueHref} className={styles.leagueName}>{leagueName}</Link>}
      </div>
      {!isMobile && <CustomDivider orientation="horizontal" flexItem />}
      <div className={styles.breadcrumbsWrapper}>
        {isMobile && <Link href={leagueHref} className={styles.leagueName}>{leagueName}</Link>}
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </div>
    {!isMobile && <CustomDivider orientation="vertical" flexItem />}
    {isMobile && <CustomDivider orientation="horizontal" flexItem />}
    <div className={styles.rightPart}>
      <div className={styles.upcomingLabel}>
        {renderTopLabel()}
      </div>
      <div className={styles.matchWrapper} tabIndex={0}>
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
            <Link href={`/teams/${match.homeTeam.id}`} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()} className={styles.team_name} >
              <span>{match.homeTeam.name}</span>
            </Link>
            <Link href={`/teams/${match.homeTeam.id}`} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()} className={styles.team_logo} >
              {homeLogoUrl && (
                <Image
                  src={homeLogoUrl}
                  alt={match.homeTeam.name}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
              )}
            </Link>
          </div>
        </div>

        {renderCenterCol()}

        {/* Away team */}
        <div className={styles.match_right_block}>
          <div className={styles.backgroundImageWrapper}>  
                <Image 
                  src={backgroundImageRight}
                  alt=""
                  className={styles.backgroundImage}
                /> 
                </div>
          <div className={styles.match_right_block_inner_wrapper}>
            <Link href={`/teams/${match.awayTeam.id}`} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()} className={styles.team_logo}>
              {awayLogoUrl && (
                <Image
                  src={awayLogoUrl}
                  alt={match.awayTeam.name}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
              )}
            </Link>
            <Link href={`/teams/${match.awayTeam.id}`} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()} className={styles.team_name}>
              <span >{match.awayTeam.name}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
}

'use client'
import { useState } from 'react';
import LineUpCard from "@/components/LineUpCard";
import MatchesHeader from "../MatchesHeader";
import Link from "next/link";
import styles from './LineUp.module.css';
import { usePathname, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import clipboard from '../../assets/pngs/clipboard.svg';
import highlightsEmpty from '../../assets/pngs/highlightsEmpty.svg';
import highlightsEmptyMobile from '../../assets/pngs/highlightsEmptyMobile.svg';
import { useGetMatchLineupQuery, useGetMatchPlayerStatsQuery, useGetMatchByIdQuery } from '@/app/store/services/api';
import MatchesStatusCard from '@/components/MatchesStatusCard';
import type { IMatchlineUp } from '@/types/api/matchLineUps';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import { useTranslations } from 'next-intl';

export const LineUp = () => {
  const pathname = usePathname();
  const { matchId } = useParams();
  const base = `/matches/${matchId}`;
  const matchIdNum = Number(matchId);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("matches.lineup");
  const tTabs = useTranslations("matches.tabs");
  
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: IMatchlineUp; teamLogo?: string } | null>(null);

  const {
    data: lineup,
    isLoading: lineupLoading,
    error: lineupError,
  } = useGetMatchLineupQuery(matchIdNum);

  const {
    data: playerStats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetMatchPlayerStatsQuery(matchIdNum);

  const { data: match } = useGetMatchByIdQuery(matchIdNum);

  const isActive = (href: string) => {
    if (href === base) {
      return pathname === base || pathname === `${base}/groups`;
    }
    return pathname.startsWith(href);
  };

  if (
    (lineupError && (lineupError as FetchBaseQueryError).status === 404) ||
    (statsError && (statsError as FetchBaseQueryError).status === 404)
  ) {
    return notFound();
  }

  if (lineupLoading || statsLoading) return null;

  const homePlayers = lineup?.homePlayers ?? [];
  const awayPlayers = lineup?.awayPlayers ?? [];
  const allEmpty = homePlayers.length === 0 && awayPlayers.length === 0;

  const getTeamLogo = (logoUrl?: string) =>
    logoUrl?.startsWith('http') ? logoUrl : undefined;

  const buildStatsProps = (player: IMatchlineUp) => {
    const stats = (playerStats ?? []).find(s => s.teamPlayerId === player.id);
    if (!stats) return {};
    return {
      rating: stats.rate,
      goals: stats.goals,
      assists: stats.assists,
      passes: stats.passes,
      passesCompleted: stats.passesCompleted,
      shots: stats.shots,
      shotsCompleted: stats.shotsCompleted,
      tackles: stats.tackles,
      interceptions: stats.interceptions,
      goalKeeperRating: stats.goalKeeperRate,
      goalsConceded: stats.goalConceded,
      penaltiesSaved: stats.savedPenalties,
      saves: stats.saves,
    };
  };

  return (
    <>
    <div className={styles.container}>
      <MatchesHeader />
      <div className={styles.tabs}>
        <Link className={`${styles.tab} ${isActive(`${base}`) ? styles.isActive : ""}`} href={base}>
          {tTabs("highlight")}
        </Link>
        <Link className={`${styles.tab} ${isActive(`${base}/stats`) ? styles.isActive : ""}`} href={`${base}/stats`}>
          {tTabs("stats")}
        </Link>
        <Link className={`${styles.tab} ${isActive(`${base}/lineup`) ? styles.isActive : ""}`} href={`${base}/lineup`}>
          {tTabs("lineup")}
        </Link>
      </div>
      <div className={styles.titleWrapper}>
        <div className={`${styles.button} ${styles.redGlow}`}>
          <Image src={clipboard} alt="" className={styles.icon} />
        </div>
        <div className={styles.title}> {t("title")}</div>
      </div>

      {allEmpty ? (
        <div className={styles.emptyWrapper}>
            <Image src={isMobile ? highlightsEmptyMobile :highlightsEmpty} alt="" />
            <div className={styles.emptyText}> {t("empty")} </div>
        </div>
      ) : (
        <div className={styles.teamsWrapper}>
          <div>
            <div className={styles.title}>{match?.homeTeam.name ?? t("homeTeamFallback")}</div>
            <LineUpCard players={homePlayers} onPlayerClick={(p) => setSelectedPlayer({ player: p, teamLogo: getTeamLogo(match?.homeTeam.logoUrl) })} />
          </div>
          <div>
            <div className={styles.title}>{match?.awayTeam.name ?? t("awayTeamFallback")}</div>
            <LineUpCard players={awayPlayers} onPlayerClick={(p) => setSelectedPlayer({ player: p, teamLogo: getTeamLogo(match?.awayTeam.logoUrl) })} />
          </div>
        </div>
      )}

    </div>

    {selectedPlayer && (
      <MatchesStatusCard
        {...buildStatsProps(selectedPlayer.player)}
        playerName={`${selectedPlayer.player.firstName} ${selectedPlayer.player.lastName}`}
        playerPicture={selectedPlayer.player.picture?.startsWith('http') ? selectedPlayer.player.picture : undefined}
        teamPicture={selectedPlayer.teamLogo}
        playerId={selectedPlayer.player.playerId}
        onClose={() => setSelectedPlayer(null)}
      />
    )}
    </>
  );
};

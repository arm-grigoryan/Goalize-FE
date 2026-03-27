"use client";
import React from "react";
import styles from './TeamOverviewStatistics.module.css';
import Image from "next/image";
import statisticsIcon from '../../assets/pngs/statisticsIcon.svg';
import TeamOverviewStatisticsCard from "../TeamOverviewStatisticsCard";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useParams } from "next/navigation";
import { useGetTeamTopPlayersQuery } from "@/app/store/services/api";
import { Loader } from "@/shared/Loader/Loader";
import type { ITeamTopPlayerEntry, ITeamTopPlayers } from "@/types/api/topPlayers";

const CATEGORY_MAP: { key: keyof ITeamTopPlayers; title: string }[] = [
  { key: "topRating", title: "Player Rating" },
  { key: "topGoal", title: "Most Goals" },
  { key: "topAssist", title: "Most Assists" },
  { key: "topYellowCard", title: "Most Yellow Cards" },
  { key: "topRedCard", title: "Most Red Cards" },
  { key: "topGoalKeeperRating", title: "Goalkeeper Rating"},
  { key: "topSaves", title: "Most Saves"},
];

export interface ITeamOverviewStatisticsProps {
  title?: string;
}

export const TeamOverviewStatistics: React.FC<ITeamOverviewStatisticsProps> = () => {
  const { teamId } = useParams();
  const id = Number(teamId);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: topPlayers, isLoading } = useGetTeamTopPlayersQuery(id, {
    skip: !id,
  });

  const categories = topPlayers
    ? CATEGORY_MAP.filter(({ key }) => topPlayers[key] !== null).map(({ key, title }) => ({
        title,
        entry: topPlayers[key] as ITeamTopPlayerEntry,
      }))
    : [];

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.buttonTitleWrapper}>
        <div className={`${styles.redButton} ${styles.redGlow}`}>
          <Image src={statisticsIcon} alt='' className={styles.trophieIcon} />
        </div>
        <div className={styles.title}>Top Players</div>
      </div>

      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : categories.length === 0 ? (
        <div className={styles.noData}>No data available</div>
      ) : (
        <div className={styles.innerContainer}>
          {categories.map(({ title, entry }) => (
            <TeamOverviewStatisticsCard
              key={title}
              title={title}
              playerName={`${entry?.teamPlayer?.firstName} ${entry?.teamPlayer?.lastName}`}
              playerPictureUrl={entry?.teamPlayer?.picture}
              playerId={entry?.teamPlayer?.playerId}
              value={entry?.value}
            />
          ))}
        </div>
      )}
    </div>
  );
};

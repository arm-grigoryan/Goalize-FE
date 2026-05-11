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
import type { ITeamTopPlayers } from "@/types/api/topPlayers";
import { useTranslations } from "next-intl";

const CATEGORY_KEYS: { key: keyof ITeamTopPlayers; titleKey: string }[] = [
  { key: "topRating", titleKey: "playerRating" },
  { key: "topGoal", titleKey: "mostGoals" },
  { key: "topAssist", titleKey: "mostAssists" },
  { key: "topYellowCard", titleKey: "mostYellowCards" },
  { key: "topRedCard", titleKey: "mostRedCards" },
  { key: "topGoalKeeperRate", titleKey: "goalkeeperRating" },
  { key: "topSaves", titleKey: "mostSaves" },
];

export interface ITeamOverviewStatisticsProps {
  title?: string;
}

export const TeamOverviewStatistics: React.FC<ITeamOverviewStatisticsProps> = () => {
  const { teamId } = useParams();
  const id = Number(teamId);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("teamOverview.statistics");

  const { data: topPlayers, isLoading } = useGetTeamTopPlayersQuery(id, {
    skip: !id,
  });

  const categories = topPlayers
    ? CATEGORY_KEYS.map(({ key, titleKey }) => ({
        title: t(titleKey),
        entry: topPlayers[key],
      }))
    : [];

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.buttonTitleWrapper}>
        <div className={`${styles.redButton} ${styles.redGlow}`}>
          <Image src={statisticsIcon} alt='' className={styles.trophieIcon} />
        </div>
        <div className={styles.title}>{t("title")}</div>
      </div>

      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <div className={styles.innerContainer}>
          {categories.map(({ title, entry }) => (
            <TeamOverviewStatisticsCard
              key={title}
              title={title}
              playerName={entry ? `${entry.teamPlayer.firstName} ${entry.teamPlayer.lastName}` : '-'}
              playerPictureUrl={entry?.teamPlayer?.picture ?? null}
              playerId={entry?.teamPlayer?.playerId ?? null}
              value={entry?.value ?? '-'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

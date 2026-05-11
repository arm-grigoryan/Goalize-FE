"use client";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import StatsCard from "@/entities/StatsCard";
import { IStatsCardInnerCardProps } from "@/entities/StatsCardInnerCard/StatsCardInnerCard.types";
import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";
import Image from "next/image";
import styles from "./Stats.module.css";
import { useParams } from "next/navigation";
import { useGetLeaguesTopPlayersQuery } from "@/app/store/services/api";
import { ITopPlayer } from "@/types/api/topPlayers";
import nextMatchEmpty from "../../assets/pngs/nextMatchEmpty.svg";
import { useTranslations } from "next-intl";

export const Stats: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const params = useParams();
  const leagueId = Number(params?.leagueId);
  const t = useTranslations("leaguesStats");

  const renderEmptyState = () => (
    <div className={styles.emptyWrapper}>
      <Image src={nextMatchEmpty} alt="" className={styles.img} />
      <p className={styles.emptyTxt}>{t("empty")}</p>
    </div>
  );

  const { data, isLoading, isError } = useGetLeaguesTopPlayersQuery(leagueId, {
    skip: !leagueId,
  });

  if (isLoading) {
    return (
      <div className={styles.loader_container}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (isError || !data || (Array.isArray(data) && data.length === 0)) {
    return renderEmptyState();
  }

  const statsData = Array.isArray(data) ? data[0] : data;

  if (!statsData) {
    return renderEmptyState();
  }

  const mapToStatsCardProps = (
    players: ITopPlayer[] = [],
  ): IStatsCardInnerCardProps[] =>
    players.map((player) => ({
      playerId: player.teamPlayer.playerId,
      teamPlayer: {
        firstName: player.teamPlayer.firstName,
        lastName: player.teamPlayer.lastName,
        picture: player.teamPlayer.picture,
        shirtNumber: player.teamPlayer.shirtNumber,
      },
      team: {
        name: player.team.name || "—",
        logoUrl: player.team.logoUrl,
        captainId: player.team.captainId,
      },
      value: player.value,
    }));

  const sections = [
    { title: t("goals"), data: statsData.topGoals },
    { title: t("assists"), data: statsData.topAssists },
    { title: t("ratings"), data: statsData.topRatings },
    { title: t("yellowCards"), data: statsData.topYellowCards },
    { title: t("redCards"), data: statsData.topRedCards },
  ];

  const nonEmptySections = sections.filter(
    (section) => section.data && section.data.length > 0,
  );

  if (nonEmptySections.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className={`${!isMobile ? styles.container : styles.mobileWrapper}`}>
      {nonEmptySections.map((section) => (
        <StatsCard
          key={section.title}
          title={section.title}
          object={mapToStatsCardProps(section.data)}
        />
      ))}
    </div>
  );
};

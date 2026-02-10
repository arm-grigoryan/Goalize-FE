"use client";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import StatsCard from "@/entities/StatsCard";
import { IStatsCardInnerCardProps } from "@/entities/StatsCardInnerCard/StatsCardInnerCard.types";
import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";
import styles from "./Stats.module.css";
import { useParams } from "next/navigation";
import { useGetLeaguesTopPlayersQuery } from "@/app/store/services/api";
import { ITopPlayer } from "@/types/api/topPlayers";

export const Stats: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const params = useParams();
  const leagueId = Number(params?.leagueId);

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
    return <div className={styles.error}>No stats found for this league.</div>;
  }

  const statsData = Array.isArray(data) ? data[0] : data;

  if (!statsData) {
    return <div className={styles.error}>No stats found.</div>;
  }

  const mapToStatsCardProps = (
    players: ITopPlayer[] = []
  ): IStatsCardInnerCardProps[] =>
    players.map((player) => ({
      teamPlayer: {
        firstName: player.teamPlayer.firstName,
        lastName: player.teamPlayer.lastName,
        picture: player.teamPlayer.picture,
        shirtNumber: player.teamPlayer.shirtNumber,
      },
      team: {
        name: "—",
        logoUrl: "",
        captainId: 0,
      },
      value: player.value,
    }));

  const sections = [
    { title: "Goals", data: statsData.topGoals },
    { title: "Assists", data: statsData.topAssists },
    { title: "Ratings", data: statsData.topRatings },
    { title: "Yellow Cards", data: statsData.topYellowCards },
    { title: "Red Cards", data: statsData.topRedCards },
  ];

  const nonEmptySections = sections.filter(
    (section) => section.data && section.data.length > 0
  );

  if (nonEmptySections.length === 0) {
    return <div className={styles.error}>No stats available for this league.</div>;
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

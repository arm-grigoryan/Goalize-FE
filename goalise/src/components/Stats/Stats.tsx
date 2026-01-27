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

  // Handle both single object and array of objects as the user changed type to ITopPlayers[]
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
        name: "—", // Temporary placeholder as requested
        logoUrl: "",
        captainId: 0,
      },
      value: player.value,
    }));

  return (
    <div className={`${!isMobile ? styles.container : styles.mobileWrapper}`}>
      <StatsCard
        title="Goals"
        object={mapToStatsCardProps(statsData.topGoals)}
      />
      <StatsCard
        title="Assists"
        object={mapToStatsCardProps(statsData.topAssists)}
      />
      <StatsCard
        title="Ratings"
        object={mapToStatsCardProps(statsData.topRatings)}
      />
      <StatsCard
        title="Yellow Cards"
        object={mapToStatsCardProps(statsData.topYellowCards)}
      />
      <StatsCard
        title="Red Cards"
        object={mapToStatsCardProps(statsData.topRedCards)}
      />
    </div>
  );
};

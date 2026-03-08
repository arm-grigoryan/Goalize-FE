"use client";
import React from "react";
import styles from "./TeamOverviewTrophies.module.css";
import Image from "next/image";
import trophieIcon from "../../assets/pngs/trophieIcon.svg";
import TeamOverviewTrophiesCard from "../TeamOverviewTrophiesCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useParams } from "next/navigation";
import { useGetTeamTrophiesQuery } from "@/app/store/services/api";
import { Loader } from "@/shared/Loader/Loader";
import type { ITeamTrophy } from "@/types/api/temas";

const typeMap: Record<ITeamTrophy["type"], "gold" | "silver" | "bronze"> = {
  Winner: "gold",
  RunnerUp: "silver",
  SemiFinalist: "bronze",
};

export const TeamOverviewTrophies: React.FC = () => {
  const { teamId } = useParams();
  const id = Number(teamId);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: trophies, isLoading } = useGetTeamTrophiesQuery(id, {
    skip: !id,
  });

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.buttonTitleWrapper}>
        <div className={`${styles.redButton} ${styles.redGlow}`}>
          <Image src={trophieIcon} alt="" className={styles.trophieIcon} />
        </div>
        <div className={styles.title}>Trophies</div>
      </div>

      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : !trophies || trophies.length === 0 ? (
        <div className={styles.noTrophies}>No trophies yet</div>
      ) : (
        <div className={styles.trophies}>
          {trophies.map((trophy, index) => (
            <TeamOverviewTrophiesCard
              key={`${trophy.leagueId}-${trophy.season}-${index}`}
              leagueId={trophy.leagueId}
              leagueName={trophy.leagueName}
              leagueLogoUrl={trophy.leagueLogoUrl}
              season={trophy.season}
              type={typeMap[trophy.type]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

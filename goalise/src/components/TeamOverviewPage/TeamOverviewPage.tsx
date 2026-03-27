"use client";
import React from "react";
import styles from "./TeamOverviewPage.module.css";
import TeamOverviewNextMatch from "@/entities/TeamOverviewNextMatch";
import TeamOverviewTrophies from "@/entities/TeamOverviewTrophies";
import { TeamOverviewStatistics } from "@/entities/TeamOverviewStatistics/TeamOverviewStatistics";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const TeamOverviewPage = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    !isMobile ? 
        <div className={styles.container}>
              <div className={styles.bottomContainer}>
                <div className={styles.innerBottomContainer}>
                  <TeamOverviewNextMatch />
                  <TeamOverviewTrophies />
                </div>
                <TeamOverviewStatistics />
              </div>
            </div> :  <div className={styles.container}>
              <div className={styles.bottomContainer}>
                <div className={styles.innerBottomContainer}>
                  <TeamOverviewNextMatch />
                  <TeamOverviewStatistics />
                </div>
                 <TeamOverviewTrophies />
              </div>
            </div>
  );
};

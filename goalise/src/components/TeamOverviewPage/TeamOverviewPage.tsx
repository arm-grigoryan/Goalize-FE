import React from "react";
import styles from './TeamOverviewPage.module.css';
import { TeamOverviewHeader } from "@/entities/TeamOverviewHeader/TeamOverviewHeader";
import TeamOverviewNextMatch from "@/entities/TeamOverviewNextMatch";
import TeamOverviewTrophies from "@/entities/TeamOverviewTrophies";
import { TeamOverviewStatistics } from "@/entities/TeamOverviewStatistics/TeamOverviewStatistics";

export const TeamOverviewPage = () => {
    return <div className={styles.container}>
        <TeamOverviewHeader />
        <div className={styles.bottomContainer}> 
        <div className={styles.innerBottomContainer}>
            <TeamOverviewNextMatch />
            <TeamOverviewTrophies />
        </div>
            <TeamOverviewStatistics />
        </div>
    </div>
}
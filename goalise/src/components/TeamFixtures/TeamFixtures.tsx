import React from "react";
import styles from './TeamFixtures.module.css';
import { TeamOverviewHeader } from "@/entities/TeamOverviewHeader/TeamOverviewHeader";
import TeamFixturesMatches from "@/entities/TeamFixturesMatches";

export const TeamFixtures: React.FC = () => {
    return <div className={styles.container}>
        <TeamOverviewHeader />
        <TeamFixturesMatches />
    </div>
}
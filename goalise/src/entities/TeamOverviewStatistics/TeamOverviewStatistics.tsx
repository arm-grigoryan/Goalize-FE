import React from "react";
import styles from './TeamOverviewStatistics.module.css';
import Image from "next/image";
import statisticsIcon from '../../assets/pngs/statisticsIcon.svg';
import TeamOverviewStatisticsCard from "../TeamOverviewStatisticsCard";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface ITeamOverviewStatisticsProps {
    title?: string;
}
export const TeamOverviewStatistics: React.FC<ITeamOverviewStatisticsProps> = () => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
           <div className={styles.buttonTitleWrapper}>
            <div className={`${styles.redButton} ${styles.redGlow}`}>
                <Image src={statisticsIcon} alt='' className={styles.trophieIcon}/>
            </div>
            <div className={styles.title}> Statistics</div>
        </div>
       <div className={styles.innerContainer}>
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
         <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
         <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
        <TeamOverviewStatisticsCard />
       </div>
    </div>
}
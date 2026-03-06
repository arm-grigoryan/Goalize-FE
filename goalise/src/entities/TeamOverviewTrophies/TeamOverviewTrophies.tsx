import React from "react";
import styles from './TeamOverviewTrophies.module.css';
import Image from "next/image";
import trophieIcon from '../../assets/pngs/trophieIcon.svg';
import TeamOverviewTrophiesCard from "../TeamOverviewTrophiesCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
export interface ITeamOverviewTrophiesProps {
    title?: string;
}
export const TeamOverviewTrophies: React.FC<ITeamOverviewTrophiesProps> = () => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
        <div className={styles.buttonTitleWrapper}>
            <div className={`${styles.redButton} ${styles.redGlow}`}>
                <Image src={trophieIcon} alt='' className={styles.trophieIcon}/>
            </div>
            <div className={styles.title}> Trophies</div>
        </div>
        <div className={styles.trophies}>
            <TeamOverviewTrophiesCard type="gold"/>
            <TeamOverviewTrophiesCard type="silver"/>
            <TeamOverviewTrophiesCard type="bronze"/>
             <TeamOverviewTrophiesCard type="gold"/>
            <TeamOverviewTrophiesCard type="silver"/>
            <TeamOverviewTrophiesCard type="bronze"/>
        </div>
     </div>
}
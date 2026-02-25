import React from "react";
import Image from "next/image";
import teamLogo from '../../assets/pngs/teamLogo.png';
import styles from './TeamOverviewStatisticsCard.module.css';
import CustomDivider from "@/shared/Divider";

export interface ITeamOverviewStatisticsCardProps {
    title?: string;
}
export const TeamOverviewStatisticsCard: React.FC<ITeamOverviewStatisticsCardProps> = () => {
    return <div className={styles.container}> 
            <div className={styles.logoNameWrapper}>
               <Image src={teamLogo} alt=""/>
                <div className={styles.texts}>
                    <div className={styles.subTitle}>Highest Rating</div>
                    <div className={styles.name}>Poghos Poghosyan</div>
                </div> 
            </div>
                <CustomDivider orientation="vertical" variant="middle" flexItem />
            <div className={styles.number}> 9/10</div>
    </div>
}
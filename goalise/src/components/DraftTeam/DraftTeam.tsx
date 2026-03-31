import DraftTeamHeader from "@/entities/DraftTeamHeader";
import Image from "next/image";
import React from "react";
import emptyImage from '../../assets/pngs/nextMatchEmpty.svg';
import styles from './DraftTeam.module.css';

export const DraftTeam: React.FC = () => {
    return <div className={styles.container}>
        <DraftTeamHeader />
        <div className={styles.imageWrapper}>
            <Image 
                src={emptyImage}
                alt=""
                className={styles.image}
            />
            <span>No data available yet — your team is still under review.</span>
        </div>
    </div>
}
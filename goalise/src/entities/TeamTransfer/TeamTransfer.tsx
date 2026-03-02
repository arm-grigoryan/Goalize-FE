import React from "react";
import styles from './TeamTransfer.module.css';
import TeamTransferCard from "../TeamTransferCard";
import teamLogo from '../../assets/pngs/teamLogo.png';
export const TeamTransfer = () => {
    return <div>
        <div className={styles.tabsContainer}>
            <div className={`${styles.tab} ${styles.isActive}`}>All</div>
            <div className={styles.tab}>Player In</div>
            <div className={styles.tab}>Player Out</div>
        </div>
        <div className={styles.transfers} >
        <TeamTransferCard 
                date={'12.09.2026'} 
                teamLogo={teamLogo}
                teamName="Team Name"
                playerIn
                playerName="Vruyr Saghatelyan"
                playerLogo={teamLogo}
                contract="25 Jul - 27 Aug"
            />
            <TeamTransferCard 
                date={'12.09.2026'} 
                teamLogo={teamLogo}
                teamName="Team Name"
                playerIn={false}
                playerName="Vruyr Saghatelyan"
                playerLogo={teamLogo}
                contract="25 Jul - 27 Aug"
            />
            <TeamTransferCard 
                date={'12.09.2026'} 
                teamLogo={teamLogo}
                teamName="Team Name"
                playerIn
                playerName="Vruyr Saghatelyan"
                playerLogo={teamLogo}
                contract="25 Jul - 27 Aug"
            />
            <TeamTransferCard 
                date={'12.09.2026'} 
                teamLogo={teamLogo}
                teamName="Team Name"
                playerIn={false}
                playerName="Vruyr Saghatelyan"
                playerLogo={teamLogo}
                contract="25 Jul - 27 Aug"
            />
        </div>
    </div>
}
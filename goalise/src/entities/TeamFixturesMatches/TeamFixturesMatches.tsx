import React from "react";
import styles from './TeamFixturesMatches.module.css';
import teamLogo from '../../assets/pngs/teamLogo.png';
import TeamsPastMatchesCard from "../TeamsPastMatchesCard";

export const TeamFixturesMatches: React.FC = () => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <div className={styles.title}>Fixtures</div>
            </div>
            <div> 
                    <TeamsPastMatchesCard
                        date={'12.12.2027'}
                        teamLogo1={teamLogo}
                        teamLogo2={teamLogo}
                        teamName1={'Team Name'}
                        teamName2={'Team Name'}
                        teamScore1={0}
                        teamScore2={0}
                        variant={"fixtures"}
                    />
            </div>
    </div>
}
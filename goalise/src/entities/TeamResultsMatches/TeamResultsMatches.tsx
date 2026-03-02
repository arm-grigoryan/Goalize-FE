import React from 'react';
import styles from './TeamResultsMatches.module.css';
import TeamsPastMatchesCard from '../TeamsPastMatchesCard';
import teamLogo from '../../assets/pngs/teamLogo.png';
export const TeamResultsMatches: React.FC = () => {
    return <div className={styles.container}>
        <div className={styles.titleWrapper}>
                <div className={styles.title}>Results</div>
            </div>
                <TeamsPastMatchesCard
                    date={'12.09.2026'}
                    teamLogo1={teamLogo}
                    teamLogo2={teamLogo}
                    teamName1={'Team Name'}
                    teamName2={'Team Name'}
                    teamScore1={0} 
                    teamScore2={10}
                    variant={"results"}
                    />
    </div>
}
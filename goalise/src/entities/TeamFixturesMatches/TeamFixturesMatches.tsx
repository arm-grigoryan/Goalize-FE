import React from "react";
import styles from './TeamFixturesMatches.module.css';
import PastMatchesInnerCard from "../PastMatchesInnerCard";
import teamLogo from '../../assets/pngs/teamLogo.png';
import winnerIcon from '../../assets/pngs/winnerIcon.svg';
import drawIcon from '../../assets/pngs/drawIcon.svg';

export const TeamFixturesMatches: React.FC = () => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <div className={styles.title}>Matches </div>
                <div className={styles.subtitle}>All the matches that are played will display here.</div>
            </div>
            <div> 
                <div className={styles.dateTitle}>Today</div>
                    <PastMatchesInnerCard 
                        date={'12.12.2027'}
                        winnerIcon={winnerIcon}
                        teamLogo1={teamLogo}
                        teamLogo2={teamLogo}
                        teamName1={'Team Name'}
                        teamName2={'Team Name'}
                        teamScore1={0}
                        teamScore2={0}
                        variant={"fixtures"}
                    />

                <div className={styles.dateTitle}>Yesterday</div>
                <PastMatchesInnerCard
                    date={'12.09.2026'}
                    winnerIcon={winnerIcon}
                    drawIcon={drawIcon}
                    teamLogo1={teamLogo}
                    teamLogo2={teamLogo}
                    teamName1={'Team Name'}
                    teamName2={'Team Name'}
                    teamScore1={0}
                    teamScore2={10}
                    variant={"results"}
                    />
            </div>
    </div>
}
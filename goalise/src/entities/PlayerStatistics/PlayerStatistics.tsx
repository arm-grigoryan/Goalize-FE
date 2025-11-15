import { IPlayerStatisticsProps } from "./PlayerStatistics.types"
import styles from './PlayerStatistics.module.css';
import startIcon from '../../assets/pngs/startIcon.png';
import ballIcon from '../../assets/pngs/ballIcon.png';
import assistsIcon from '../../assets/pngs/assistsIcon.png';
import shotsIcon from '../../assets/pngs/shotsIcon.png';
import passesIcon from '../../assets/pngs/passesIcon.png';
import redCardIcon from '../../assets/pngs/redCardIcon.png';
import yellowCardIcon from '../../assets/pngs/yellowCardIcon.png';
import savedPenaltiesIcon from '../../assets/pngs/savedPenaltiesIcon.png';
import savesIcon from '../../assets/pngs/savesIcon.png';
import soccerIcon from '../../assets/pngs/soccerIcon.png';
import Image from "next/image";
import cardIcon from '../../assets/pngs/cardIcon.png';

 const PlayerStatistics: React.FC<IPlayerStatisticsProps> = ({
    gamesPlayed,
    averageRate,
    goals,
    assists,
    shots,
    shotsCompleted,
    shotAccuracyPercent,
    passes,
    passesCompleted,
    passAccuracyPercent,
    tackles,
    interceptions, 
    redCards, 
    yellowCards, 
    averageGoalkeeperRate, 
    goalsConceded, 
    savedPenalties, 
    saves, 
 }) => {
    const stats = [
    { label: "Average Rate", value: averageRate, icon: startIcon},
    { label: "Goals", value: goals, icon: ballIcon},
    { label: "Assists", value: assists, icon: assistsIcon },
    { label: "Shots Completed", value: shotsCompleted, icon: shotsIcon },
    { label: "Passes Completed", value: passesCompleted, icon: passesIcon },
    { label: "Red Cards", value: redCards, icon: cardIcon },
    { label: "Yellow Cards", value: yellowCards, icon: cardIcon },
    { label: "Rating", value: averageGoalkeeperRate, icon: startIcon },
    { label: "Goals Conceded", value: goalsConceded, icon: soccerIcon},
    { label: "Saved Penalties", value: savedPenalties, icon: savedPenaltiesIcon },
    { label: "Saves", value: saves, icon: savesIcon },
  ];

    return <div className={styles.container}>
            <div className={styles.titleContainer}> 
                <div className={styles.title}> Player Statistics</div>
                <div className={styles.button}> Games Played: <span>{gamesPlayed} </span></div>
            </div>
            <div className={styles.stats}> 
                {stats.map(
                    (stat, index) =>
                        <div key={index} className={styles.statItem}>
                            <div className={styles.labelContainer}>
                             <div
                                className={
                                    `${styles.iconWrapper} ${averageGoalkeeperRate ? styles.blueGlow : styles.redGlow}`
                                }
                                >
                                <Image src={stat.icon} alt="" className={styles.statIcon} />
                            </div>
                             <div className={styles.label}>{stat.label}</div>
                            </div>
                            <div className={styles.stroke}> </div>
                            <div className={styles.value}>{stat.value}</div>
                        </div>
                )}
            </div>
     </div>
 }

 PlayerStatistics.displayName = 'PlayerStatistics';
 export default PlayerStatistics;
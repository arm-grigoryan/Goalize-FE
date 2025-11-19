import { IPlayerStatisticsProps } from "./PlayerStatistics.types";
import styles from './PlayerStatistics.module.css';

import Image from "next/image";

import startIcon from '../../assets/pngs/startIcon.png';
import ballIcon from '../../assets/pngs/ballIcon.png';
import shotsIcon from '../../assets/pngs/shotsIcon.png';
import passesIcon from '../../assets/pngs/passesIcon.png';
import savedPenaltiesIcon from '../../assets/pngs/savedPenaltiesIcon.png';
import savesIcon from '../../assets/pngs/savesIcon.png';
import soccerIcon from '../../assets/pngs/soccerIcon.png';
import cardIcon from '../../assets/pngs/cardIcon.png';
import interceptionsIcon from '../../assets/pngs/interceptions.png';
import tacklesIcon from '../../assets/pngs/tackles.png';
import peopleIcon from '../../assets/pngs/peopleIcon.png';
import en from '../../../messages/en.json';

const PlayerStatistics: React.FC<IPlayerStatisticsProps> = ({
  gamesPlayed,
  averageRate,
  goals,
  assists,
  shotsCompleted,
  shotAccuracyPercent,
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
    { label: en.playerProfile.playerStatistics.avergaePlayerRate, value: averageRate, icon: startIcon },
    { label: en.playerProfile.playerStatistics.goals, value: goals, icon: ballIcon },
    { label: en.playerProfile.playerStatistics.assists, value: assists, icon: peopleIcon },
    { label: en.playerProfile.playerStatistics.shotsCompleted, value: shotsCompleted, icon: shotsIcon, shotsAccuracy: shotAccuracyPercent },
    { label: en.playerProfile.playerStatistics.passesCompleted, value: passesCompleted, icon: passesIcon, passesAccuracy: passAccuracyPercent },
    { label: en.playerProfile.playerStatistics.tackles, value: tackles, icon: tacklesIcon },
    { label: en.playerProfile.playerStatistics.interceptions, value: interceptions, icon: interceptionsIcon },
    { label: en.playerProfile.playerStatistics.redCards, value: redCards, icon: cardIcon },
    { label: en.playerProfile.playerStatistics.yellowCards, value: yellowCards, icon: cardIcon, isYellowCard: true },
    { label: en.playerProfile.playerStatistics.averageGoalKeeperRate, value: averageGoalkeeperRate, icon: startIcon, isGoalKeeper: true },
    { label: en.playerProfile.playerStatistics.goalsConceded, value: goalsConceded, icon: soccerIcon, isGoalKeeper: true },
    { label: en.playerProfile.playerStatistics.savedPenalties, value: savedPenalties, icon: savedPenaltiesIcon, isGoalKeeper: true },
    { label: en.playerProfile.playerStatistics.saves, value: saves, icon: savesIcon, isGoalKeeper: true },
  ];

  const hasGoalKeeperStats = stats.some(stat => stat.isGoalKeeper);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {en.playerProfile.playerStatistics.title}
          {hasGoalKeeperStats && (
            <span className={styles.content}>{en.playerProfile.playerStatistics.label}</span>
          )}
        </div>

       <div className={styles.button}>
          {en.playerProfile.playerStatistics.buttonText}: <span>{gamesPlayed}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.labelContainer}>
              <div
                className={
                  `${styles.iconWrapper} ${
                    stat.isGoalKeeper
                      ? styles.blueGlow
                      : stat.isYellowCard
                      ? styles.yellowGlow
                      : styles.redGlow
                  }`
                }
              >
                <Image src={stat.icon} alt="" className={styles.statIcon} />
              </div>

              <div className={styles.label}>{stat.label}</div>
            </div>

            <div className={styles.stroke}></div>

            <div className={styles.accuracy}>
              {(stat.shotsAccuracy || stat.passesAccuracy) && (
                <span className={styles.bluePercent}>
                  {(stat.shotsAccuracy || stat.passesAccuracy) + "%"}
                </span>
              )}
            </div>

            <div className={styles.value}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

PlayerStatistics.displayName = "PlayerStatistics";
export default PlayerStatistics;

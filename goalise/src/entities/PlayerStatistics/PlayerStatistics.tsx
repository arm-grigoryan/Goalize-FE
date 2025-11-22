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
import { useTranslations } from "next-intl";

export const PlayerStatistics: React.FC<IPlayerStatisticsProps> = ({
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
  const t = useTranslations("playerProfile.playerStatistics")
  const stats = [
    { label:t("avergaePlayerRate"), value: averageRate, icon: startIcon },
    { label:t("goals"), value: goals, icon: ballIcon },
    { label:t("assists"), value: assists, icon: peopleIcon },
    { label:t("shotsCompleted"), value: shotsCompleted, icon: shotsIcon, shotsAccuracy: shotAccuracyPercent },
    { label:t("passesCompleted"), value: passesCompleted, icon: passesIcon, passesAccuracy: passAccuracyPercent },
    { label:t("tackles"), value: tackles, icon: tacklesIcon },
    { label:t("interceptions"), value: interceptions, icon: interceptionsIcon },
    { label:t("redCards"), value: redCards, icon: cardIcon },
    { label:t("yellowCards"), value: yellowCards, icon: cardIcon, isYellowCard: true },
    { label:t("averageGoalKeeperRate"), value: averageGoalkeeperRate, icon: startIcon, isGoalKeeper: true },
    { label:t("goalsConceded"), value: goalsConceded, icon: soccerIcon, isGoalKeeper: true },
    { label:t("savedPenalties"), value: savedPenalties, icon: savedPenaltiesIcon, isGoalKeeper: true },
    { label:t("saves"), value: saves, icon: savesIcon, isGoalKeeper: true },
  ];


  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {t("title")}
        </div>

       <div className={styles.button}>
          {t("buttonText")}: <span>{gamesPlayed}</span>
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

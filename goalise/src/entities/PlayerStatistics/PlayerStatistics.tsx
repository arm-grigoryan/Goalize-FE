import { IPlayerStatisticsProps } from "./PlayerStatistics.types";
import styles from "./PlayerStatistics.module.css";

import Image from "next/image";

import startIcon from "../../assets/pngs/star.svg";
import ballIcon from "../../assets/pngs/goals.svg";
import shotsIcon from "../../assets/pngs/shots.svg";
import passesIcon from "../../assets/pngs/passes.svg";
import savedPenaltiesIcon from "../../assets/pngs/savedPenalties.svg";
import savesIcon from "../../assets/pngs/saves.svg";
import goalsConcededIcon from "../../assets/pngs/goalsConceded.svg";
import cardIcon from "../../assets/pngs/card.svg";
import interceptionsIcon from "../../assets/pngs/interceptions.png";
import tacklesIcon from "../../assets/pngs/tackles.png";
import assistsIcon from "../../assets/pngs/assists.svg";
import { useTranslations } from "next-intl";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { Tooltip } from "@mui/material";

export const PlayerStatistics: React.FC<IPlayerStatisticsProps> = ({
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
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("playerProfile.playerStatistics");
  const stats = [
    { label: t("avergaePlayerRate"), value: averageRate, icon: startIcon },
    { label: t("goals"), value: goals, icon: ballIcon },
    { label: t("assists"), value: assists, icon: assistsIcon },
    {
      label: t("shotsCompleted"),
      value:
        shots === 0
          ? 0
          : shots !== undefined
            ? `${shotsCompleted ?? 0}/${shots}`
            : shotsCompleted,
      icon: shotsIcon,
      shotsAccuracy:
        shots !== undefined && shots > 0 ? shotAccuracyPercent : undefined,
    },
    {
      label: t("passesCompleted"),
      value:
        passes === 0
          ? 0
          : passes !== undefined
            ? `${passesCompleted ?? 0}/${passes}`
            : passesCompleted,
      icon: passesIcon,
      passesAccuracy:
        passes !== undefined && passes > 0 ? passAccuracyPercent : undefined,
    },
    { label: t("tackles"), value: tackles, icon: tacklesIcon },
    {
      label: t("interceptions"),
      value: interceptions,
      icon: interceptionsIcon,
    },
    { label: t("redCards"), value: redCards, icon: cardIcon },
    {
      label: t("yellowCards"),
      value: yellowCards,
      icon: cardIcon,
      isYellowCard: true,
    },
    {
      label: t("averageGoalKeeperRate"),
      value: averageGoalkeeperRate,
      icon: startIcon,
      isGoalKeeper: true,
    },
    {
      label: t("goalsConceded"),
      value: goalsConceded,
      icon: goalsConcededIcon,
      isGoalKeeper: true,
    },
    {
      label: t("savedPenalties"),
      value: savedPenalties,
      icon: savedPenaltiesIcon,
      isGoalKeeper: true,
    },
    { label: t("saves"), value: saves, icon: savesIcon, isGoalKeeper: true },
  ];

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{t("title")}</div>

        <div className={styles.button}>
          {t("buttonText")}: <span>{gamesPlayed}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.labelContainer}>
              <div
                className={`${styles.iconWrapper} ${
                  stat.isGoalKeeper
                    ? styles.blueGlow
                    : stat.isYellowCard
                      ? styles.yellowGlow
                      : styles.redGlow
                }`}
              >
                <Image src={stat.icon} alt="" className={styles.statIcon} />
              </div>

              <div className={styles.label}>{stat.label}</div>
            </div>

            <div className={styles.stroke}></div>

            {!isMobile && (
              <div className={styles.accuracy}>
                {(stat.shotsAccuracy || stat.passesAccuracy) && (
                  <span className={styles.bluePercent}>
                    {(stat.shotsAccuracy || stat.passesAccuracy) + "%"}
                  </span>
                )}
              </div>
            )}
            {isMobile ? (
              <Tooltip
                title={
                  (stat.shotsAccuracy || stat.passesAccuracy) &&
                  (shotAccuracyPercent || passAccuracyPercent) + " %"
                }
                placement="top"
              >
                <div className={styles.value}>{stat.value}</div>
              </Tooltip>
            ) : (
              <div className={styles.value}>{stat.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

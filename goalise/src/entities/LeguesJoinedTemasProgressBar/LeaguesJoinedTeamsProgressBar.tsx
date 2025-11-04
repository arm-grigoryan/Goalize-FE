"use client";

import styles from "./LeguesJoinedTemasProgressBar.module.css";

interface LeaguesJoinedTeamsProgressBarProps {
  maxTeamsCount: number;
  registeredTeamsCount: number;
}

export const LeaguesJoinedTeamsProgressBar = ({
  maxTeamsCount,
  registeredTeamsCount,
}: LeaguesJoinedTeamsProgressBarProps) => {
  const progress =
    maxTeamsCount > 0
      ? Math.min((registeredTeamsCount / maxTeamsCount) * 100, 100)
      : 0;

  return (
    <div className={styles.progressContainer}>
      <div
        className={styles.progressFill}
        style={{ width: `${progress}%` }}
      ></div>
      <div className={styles.progressText}>
        {registeredTeamsCount} / {maxTeamsCount}
      </div>
    </div>
  );
};

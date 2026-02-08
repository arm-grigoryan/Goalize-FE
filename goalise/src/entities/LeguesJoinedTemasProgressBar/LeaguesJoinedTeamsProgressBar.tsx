"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import styles from "./LeguesJoinedTemasProgressBar.module.css";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

interface LeaguesJoinedTeamsProgressBarProps {
  maxTeamsCount: number;
  registeredTeamsCount: number;
}

export const LeaguesJoinedTeamsProgressBar = ({
  maxTeamsCount,
  registeredTeamsCount,
}: LeaguesJoinedTeamsProgressBarProps) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const progress =
    maxTeamsCount > 0
      ? Math.min((registeredTeamsCount / maxTeamsCount) * 100, 100)
      : 0;

  return (
    <div className={styles.progressContainer}>
      <div
        className={styles.progressFill}
        style={{ width: `${progress}%` }}
      >
        {!isMobile && 
        <span className={styles.progressText}>
          {registeredTeamsCount} / {maxTeamsCount}
        </span> }
      </div>
    </div>
  );
};

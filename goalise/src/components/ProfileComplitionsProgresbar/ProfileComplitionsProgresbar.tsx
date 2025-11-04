"use client";

import styles from "./ProfileComplitionsProgresbar.module.css";

type ProfileComplitionsProgresbarProps = {
  value: number; // 0 - 100
};

export const ProfileComplitionsProgresbar = ({
  value,
}: ProfileComplitionsProgresbarProps) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={styles.container}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div className={styles.fill} style={{ width: `${safeValue}%` }} />
        <div
          className={`${styles.circle} ${styles.circle_0} ${
            safeValue >= 0 ? styles.active : ""
          }`}
        />
        <div
          className={`${styles.circle} ${styles.circle_33} ${
            safeValue >= 33 ? styles.active : ""
          }`}
        />
        <div
          className={`${styles.circle} ${styles.circle_66} ${
            safeValue >= 66 ? styles.active : ""
          }`}
        />
        <div
          className={`${styles.circle} ${styles.circle_100} ${
            safeValue >= 100 ? styles.active : ""
          }`}
        />
      </div>
    </div>
  );
};

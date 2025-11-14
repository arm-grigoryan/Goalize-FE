"use client";

import { useGetUserInfoQuery } from "@/app/store/services/api";
import styles from "./ProfileComplitionsProgresbar.module.css";

export const ProfileComplitionsProgresbar = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const safeValue = userInfo?.profileCompletionInfo?.percentage || 0;
  let pointDistance = 0;

  return (
    <div className={styles.container}>
      <div className={styles.steps_name_wrapper}>
        {userInfo?.profileCompletionInfo?.steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <span>{step.name}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div className={styles.fill} style={{ width: `${safeValue}%` }} />
        {userInfo?.profileCompletionInfo?.steps.map((step, index) => {
          pointDistance += step.percentage;
          console.log(pointDistance, "point distance");

          return (
            <div
              key={index}
              className={`${styles.circle} ${styles.circle_0} ${
                safeValue >= 0 ? styles.active : ""
              }`}
              style={{ left: `${pointDistance}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

"use client";

import { useGetUserInfoQuery } from "@/app/store/services/api";
import styles from "./ProfileComplitionsProgresbar.module.css";

export const ProfileComplitionsProgresbar = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  console.log(userInfo, "user info in progres bar");
  const safeValue = userInfo?.profileCompletionInfo?.percentage || 0;
  let pointDistance = 0;
  console.log(safeValue, "value");

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
        {/* <div
          className={`${styles.circle} ${styles.circle_0} ${
            safeValue >= 0 ? styles.active : ""
          }`}
          style={{ left: "0%" }}
        />
        <div
          className={`${styles.circle} ${styles.circle_33} ${
            safeValue >= 33 ? styles.active : ""
          }`}
          style={{ left: "33.33%" }}
        />
        <div
          className={`${styles.circle} ${styles.circle_66} ${
            safeValue >= 66 ? styles.active : ""
          }`}
          style={{ left: "66.66%" }}
        />
        <div
          className={`${styles.circle} ${styles.circle_100} ${
            safeValue >= 100 ? styles.active : ""
          }`}
          style={{ left: "100%" }}
        /> */}
      </div>
    </div>
  );
};

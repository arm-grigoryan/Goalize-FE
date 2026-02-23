"use client";

import { useGetUserInfoQuery } from "@/app/store/services/api";
import styles from "./ProfileComplitionsProgresbar.module.css";
import Image from "next/image";

import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const ProfileComplitionsProgresbar = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const safeValue = userInfo?.profileCompletionInfo?.percentage || 0;
  let pointDistance = 0;
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
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

          return (
            <div
              key={index}
              className={styles.pointWrapper}
              style={{ left: `${pointDistance}%` }}
            >
              <div className={styles.iconWrapper}>
                <Image
                  src={step.iconUrl}
                  alt={step.name}
                  width={24}
                  height={24}
                  className={styles.icon}
                />
              </div>
              <div className={styles.percentageText}>{pointDistance}%</div>
              <div
                className={`${styles.circle} ${
                  safeValue >= pointDistance ? styles.active : ""
                }`}
              />
              <span className={styles.stepLabel}>{step.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

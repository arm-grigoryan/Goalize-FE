"use client";

import { useGetUserInfoQuery } from "@/app/store/services/api";
import styles from "./ProfileComplitionsProgresbar.module.css";
import Image from "next/image";

import basicInfoIcon from "../../assets/pngs/basicInfoIcon.svg";
import profilePictureIcon from "../../assets/pngs/profilePictureIcon.svg";
import footIcon from "../../assets/pngs/footIcon.svg";
import emailIcon from "../../assets/pngs/emailIcon.svg";

const STEP_ICONS = [
  basicInfoIcon,
  profilePictureIcon,
  footIcon,
  emailIcon,
];

export const ProfileComplitionsProgresbar = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const safeValue = userInfo?.profileCompletionInfo?.percentage || 0;
  let pointDistance = 0;

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
                  src={STEP_ICONS[index]}
                  alt={step.name}
                  width={24}
                  height={24}
                  className={styles.icon}
                />
              </div>

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

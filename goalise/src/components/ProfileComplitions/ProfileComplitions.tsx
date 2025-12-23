"use client";

import styles from "./ProfileComplitions.module.css";
import { useTranslations } from "next-intl";
import Button from "@/shared/Button";
import ProfileComplitionsProgresbar from "../ProfileComplitionsProgresbar";
import { useGetUserInfoQuery } from "@/app/store/services/api";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const ProfileComplitions = () => {
  const { data: userInfo } = useGetUserInfoQuery();

  const t = useTranslations("common");
  const handleCLick = () => {
    // clicked
  };
  if ((userInfo?.profileCompletionInfo?.percentage ?? 0) >= 100) return null;
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={`${styles.profile_complitions} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.info_wrapperS}>
        <div className={styles.textWrapper}> 
          <div className={styles.title}>{t("ProfileComplition.title")}</div>
          <div className={styles.introduction}>
            <span>{t("ProfileComplition.introduction")}</span>
          </div>
        </div>
        {!isMobile && 
        <div className={styles.buttonWrapper}> 
        <Button
          content={t("ProfileComplition.buttonContent")}
          className="white_button"
          handleClick={handleCLick}
        /></div>}
      </div>
      <div className={styles.progressbar_wrapper}>
        <ProfileComplitionsProgresbar />
      </div>
      {isMobile && 
      <div className={styles.buttonWrapper}> 
        <Button
          content={t("ProfileComplition.buttonContent")}
          className="white_button"
          handleClick={handleCLick}
        />
        </div>
        }
    </div>
  );
};

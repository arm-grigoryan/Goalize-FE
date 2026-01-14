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
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const t = useTranslations("common");
  const handleCLick = () => {
    if (process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY) {
      window.location.href = process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY;
    }
  };
  if (!userInfo || (userInfo?.profileCompletionInfo?.percentage ?? 0) >= 100)
    return null;
  return (
    <div
      className={`${styles.profile_complitions} ${
        isMobile ? styles.mobile : ""
      }`}
    >
      <div className={styles.info_wrapperS}>
        <div className={styles.textWrapper}>
          <div className={styles.title}>{t("ProfileComplition.title")}</div>
        </div>
        {!isMobile && (
          <div className={styles.buttonWrapper}>
            <Button
              content={t("ProfileComplition.buttonContent")}
              className="white_button"
              handleClick={handleCLick}
            />
          </div>
        )}
      </div>
      <div className={styles.progressbar_wrapper}>
        <ProfileComplitionsProgresbar />
      </div>
      {isMobile && (
        <div className={styles.buttonWrapper}>
          <Button
            content={t("ProfileComplition.buttonContent")}
            className="white_button"
            handleClick={handleCLick}
          />
        </div>
      )}
    </div>
  );
};

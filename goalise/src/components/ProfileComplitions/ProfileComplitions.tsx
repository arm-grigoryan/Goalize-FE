"use client";

import styles from "./ProfileComplitions.module.css";
import { useTranslations } from "next-intl";
import Button from "@/shared/Button";
import ProfileComplitionsProgresbar from "../ProfileComplitionsProgresbar";
import { useGetUserInfoQuery } from "@/app/store/services/api";

export const ProfileComplitions = () => {
  const { data: userInfo } = useGetUserInfoQuery();

  const t = useTranslations("common");
  const handleCLick = () => {
    // clicked
  };
  if ((userInfo?.profileCompletionInfo?.percentage ?? 0) >= 100) return null;
  return (
    <div className={styles.profile_complitions}>
      <div className={styles.info_wrapperS}>
        <h2>{t("ProfileComplition.title")}</h2>
        <div>
          <span>{t("ProfileComplition.introduction")}</span>
        </div>
        <Button
          content={t("ProfileComplition.buttonContent")}
          className="white_button"
          handleClick={handleCLick}
        />
      </div>
      <div>
        <ProfileComplitionsProgresbar />
      </div>
    </div>
  );
};

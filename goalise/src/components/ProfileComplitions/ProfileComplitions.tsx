"use client";

import styles from "./ProfileComplitions.module.css";
import { useTranslations } from "next-intl";
import Button from "@/shared/Button";

export const ProfileComplitions = () => {
  const t = useTranslations("common");
  const handleCLick = () => {
    console.log("clickd");
  };
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
      <div></div>
    </div>
  );
};

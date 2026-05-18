"use client";

import styles from "./ProfileComplitions.module.css";
import { useTranslations } from "next-intl";
import Button from "@/shared/Button";
import ProfileComplitionsProgresbar from "../ProfileComplitionsProgresbar";
import { useGetUserInfoQuery } from "@/app/store/services/api";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import Image from "next/image";

export const ProfileComplitions = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const t = useTranslations("common");
  const handleClick = () => {
    const authority = process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY;
    const clientId = process.env.NEXT_PUBLIC_IDENTITY_CLIENT_ID;

    if (!authority || !clientId) return;

    const returnTo = `${window.location.pathname}${window.location.search}`;

    const url = new URL(authority);

    url.searchParams.set("client_id", clientId);
    url.searchParams.set("returnTo", returnTo);

    window.location.href = url.toString();
  };

  if (!userInfo || (userInfo?.profileCompletionInfo?.percentage ?? 0) >= 100)
    return null;
  return (
    <div
      className={`${styles.profile_complitions} ${
        isMobile ? styles.mobile : ""
      }`}
    >
      <Image src="/pngs/nextMatchLeftInnerBackground.png" alt="" className={styles.bgImage} aria-hidden width={600} height={300} />
      <div className={styles.info_wrapperS}>
        <div className={styles.textWrapper}>
          <div className={styles.title}>{t("ProfileComplition.title")}</div>
        </div>
        {!isMobile && (
          <div className={styles.buttonWrapper}>
            <Button
              content={t("ProfileComplition.buttonContent")}
              className="white_button"
              handleClick={handleClick}
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
            handleClick={handleClick}
          />
        </div>
      )}
    </div>
  );
};

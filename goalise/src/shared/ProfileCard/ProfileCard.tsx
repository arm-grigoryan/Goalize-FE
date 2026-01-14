import React from "react";
import { IProfileCardProps } from "./ProfileCard.types";
import styles from "./ProfileCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useGetUserInfoQuery } from "@/app/store/services/api";

export const ProfileCard: React.FC<IProfileCardProps> = ({
  logIn,
  onAuthClick,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: userInfo } = useGetUserInfoQuery();

  // Determine whether to show "Create Team" or "My Team"
  const hasTeam =
    userInfo?.playerInfo?.team !== null &&
    userInfo?.playerInfo?.team !== undefined;
  const shouldShowCreateTeam = !hasTeam;
  const teamMenuLabel = shouldShowCreateTeam
    ? t("home.profileCard.createTeam")
    : t("home.profileCard.myTeam");
  const teamMenuRoute = shouldShowCreateTeam ? "/teams/create" : "/teams";

  const playerId = userInfo?.playerInfo?.id;

  const handleProfileClick = () => {
    if (playerId) {
      router.push(`/profile/${playerId}`);
    }
  };

  const handleTeamClick = () => {
    router.push(teamMenuRoute);
  };

  const handleAccountClick = () => {
    if (process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY) {
      window.location.href = process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY;
    }
  };

  if (!logIn) {
    return (
      <div className={styles.container}>
        <div className={`${styles.item} ${styles.login}`} onClick={onAuthClick}>
          {t("home.profileCard.logIn")}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={handleProfileClick}>
        {t("home.profileCard.profile")}
      </div>
      <div className={styles.item} onClick={handleTeamClick}>
        {teamMenuLabel}
      </div>
      <div className={styles.item} onClick={handleAccountClick}>
        {t("home.profileCard.account")}
      </div>
      <div className={`${styles.item} ${styles.login}`} onClick={onAuthClick}>
        {t("home.profileCard.logOut")}
      </div>
    </div>
  );
};

import React from "react";
import { useCallback } from "react";
import { IProfileCardProps } from "./ProfileCard.types";
import styles from "./ProfileCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useGetUserInfoQuery } from "@/app/store/services/api";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const ProfileCard: React.FC<IProfileCardProps> = ({
  logIn,
  onAuthClick,
  onCreateTeamClick,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations();
  const router = useRouter();
  const { data: userInfo } = useGetUserInfoQuery();
  const draftTeamId = userInfo?.playerInfo?.draftTeamId;
  const team = userInfo?.playerInfo?.team;

  const hasTeam = !!team || !!draftTeamId;

  const shouldShowCreateTeam = !hasTeam;
  const teamMenuLabel = shouldShowCreateTeam
    ? t("home.profileCard.createTeam")
    : t("home.profileCard.myTeam");

  let teamMenuRoute = "/teams";
  if (team) {
    teamMenuRoute = `/teams/${team.id}`;
  } else if (draftTeamId) {
    teamMenuRoute = `/teams/draft/${draftTeamId}`;
  }

  const playerId = userInfo?.playerInfo?.id;

  const handleProfileClick = useCallback(() => {
    if (playerId) {
      router.push(`/profile/${playerId}`);
    }
  }, [playerId, router]);

  const handleTeamClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldShowCreateTeam) {
      e.stopPropagation();
      onCreateTeamClick?.();
      return;
    }
    router.push(teamMenuRoute);
  }, [router, teamMenuRoute, shouldShowCreateTeam, onCreateTeamClick]);

  const handleAccountClick = useCallback(() => {
    const authority = process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY;
    const clientId = process.env.NEXT_PUBLIC_IDENTITY_CLIENT_ID;

    if (!authority || !clientId) return;

    const returnTo = `${window.location.pathname}${window.location.search}`;

    const url = new URL(authority);

    url.searchParams.set("client_id", clientId);
    url.searchParams.set("returnTo", returnTo);

    window.location.href = url.toString();
  }, []);

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
    <div className={`${isMobile ? styles.mobile : styles.container}`}>
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

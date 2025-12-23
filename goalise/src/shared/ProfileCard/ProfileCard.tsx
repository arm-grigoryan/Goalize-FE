import React from "react";
import { IProfileCardProps } from "./ProfileCard.types";
import styles from './ProfileCard.module.css';
import { useTranslations } from "next-intl";
export const ProfileCard:React.FC<IProfileCardProps> = ({
    profile,
    myTeam,
    account,
    logIn,
}) => {
      const t = useTranslations();
    return <div className={styles.container}>
        {profile && <div className={styles.item}>{t("home.profileCard.profile")}</div>}
        {myTeam && <div className={styles.item}>{t("home.profileCard.myTeam")}</div>}
        {account && <div className={styles.item}>{t("home.profileCard.account")}</div>}
        <div className={`${styles.item} ${styles.login}`}>{logIn ? t("home.profileCard.logIn") : t("home.profileCard.logout")}</div>
    </div>
}
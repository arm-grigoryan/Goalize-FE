"use client";
import Image from "next/image";
import styles from "./Footer.module.css";
import logo from "/public/pngs/logo/Logo.png";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSelect from "@/shared/LanguageSelect";

export const Footer = () => {
  const t = useTranslations();

  return (
    <div className={styles.footer}>
      <div className={styles.top_footer}>
        <Image alt="" src={logo} className={styles.logo_wrapper} />
        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            {t("header.menu.home")}
          </Link>
          <Link href="/" className={styles.link}>
            {t("header.menu.leagues")}
          </Link>
          <Link href="/" className={styles.link}>
            {t("header.menu.teams")}
          </Link>
          <Link href="/" className={styles.link}>
            {t("header.menu.events")}
          </Link>
        </div>
        <div>
          <LanguageSelect />
        </div>
        <div className={styles.contact_info}>
          <span>{t("footer.contactInfo.title")}</span>
          <span>{t("footer.contactInfo.email")}</span>
          <span>{t("footer.contactInfo.phone")}</span>
        </div>
      </div>
      <div className={styles.bottom_footer}>
        <span>{t("footer.rights")}</span>
        <div className={styles.privacy_terms}>
          <span>{t("footer.privacy")}</span>
          <span>{t("footer.terms")}</span>
        </div>

        <div>
          <span>{t("footer.followUs")}</span>
        </div>
      </div>
    </div>
  );
};

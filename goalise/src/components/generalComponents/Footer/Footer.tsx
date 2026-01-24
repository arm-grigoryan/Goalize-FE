"use client";
import Image from "next/image";
import styles from "./Footer.module.css";
import logo from "/public/pngs/logo/Logo.svg";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSelect from "@/shared/LanguageSelect";
import instagramIcon from '../../../assets/pngs/instagramIcon.svg.png';
import tiktokIcon from '../../../assets/pngs/tiktokIcon.svg.png';
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
export const Footer = () => {
  const t = useTranslations();
   const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={`${styles.footer} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.top_footer}>
        <div className={styles.logo_wrapper}> 
          <Image alt="" src={logo} className={styles.logo} />
          {isMobile &&  
            <div className={styles.socials}>
            <div className={styles.socials_icons}> 
              <Image src={instagramIcon} alt="" className={styles.instaIcon}/>
              <Image src={tiktokIcon} alt="" className={styles.icon}/>
            </div>
          </div>
          }
        </div>
        {/* <div className={styles.links}>
            <div> Site Map</div>
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
        <div className={styles.privacy_terms}>
          <div> Legal </div>
          <span className={styles.text}>{t("footer.privacy")}</span>
          <span className={styles.text}>{t("footer.terms")}</span>
        </div>
        <div className={styles.contact_info}>
          <span>{t("footer.contactInfo.title")}</span>
          <span className={styles.text}>{t("footer.contactInfo.email")}</span>
          <span className={styles.text}>{t("footer.contactInfo.phone")}</span>
        </div> */}

        <div className={styles.info_sections}> 
        <div className={styles.links}>
            <div> Site Map</div>
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
        <div className={styles.privacy_terms}>
          <div> Legal </div>
          <span className={styles.text}>{t("footer.privacy")}</span>
          <span className={styles.text}>{t("footer.terms")}</span>
        </div>
        <div className={styles.contact_info}>
          <span>{t("footer.contactInfo.title")}</span>
          <span className={styles.text}>{t("footer.contactInfo.email")}</span>
          <span className={styles.text}>{t("footer.contactInfo.phone")}</span>
        </div>
      </div>
      {isMobile && 
          <div className={styles.rights_language}>
            <LanguageSelect />
            <span>{t("footer.rights")}</span> 
          </div>
      }
      </div>
     {!isMobile && 
      <div className={styles.bottom_footer}> 
          <div className={styles.socials}>
              <div className={styles.socials_icons}> 
                <Image src={instagramIcon} alt="" className={styles.instaIcon}/>
                <Image src={tiktokIcon} alt="" className={styles.icon}/>
              </div>
            </div>
            <div className={styles.rights_language}>
            <LanguageSelect />
            <span>{t("footer.rights")}</span> 
          </div>
        </div>
      }
      </div>
  );
};

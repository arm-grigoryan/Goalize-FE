"use client";
import Image from "next/image";
import styles from "./Footer.module.css";
import logo from "../../../../public/pngs/logo/Logo.svg";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSelect from "@/shared/LanguageSelect";
import instagramIcon from '../../../assets/pngs/instagramIcon.svg.png';
import tiktokIcon from '../../../assets/pngs/tiktokIcon.svg.png';
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useRef, useState } from "react";
import arrowDown from "../../../assets/pngs/arrowDown.svg";
import { useGetLeaguesQuery } from "@/app/store/services/api";

export const Footer = () => {
  const t = useTranslations();
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const [showDropdown, setShowDropdown] = useState(false);

  const leaguesButtonRef = useRef<HTMLSpanElement>(null);
  const leaguesDropdownRef = useRef<HTMLDivElement>(null);
  const { data: leaguesData } = useGetLeaguesQuery();
  return (
    <div className={`${styles.footer} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.top_footer}>
        <div className={styles.logo_wrapper}>
          <Image alt="" src={logo} className={styles.logo} />
          {isMobile &&
            <div className={styles.socials}>
              <div className={styles.socials_icons}>
                <Image src={instagramIcon} alt="" className={styles.instaIcon} />
                <Image src={tiktokIcon} alt="" className={styles.icon} />
              </div>
            </div>
          }
        </div>

        <div className={styles.info_sections}>
          <div className={styles.links}>
            <div> Site Map</div>
            <Link href="/" className={styles.link}>
              {t("header.menu.home")}
            </Link>
            <span
              className={`${styles.leagues} ${showDropdown ? styles.active : ""
                }`}
              ref={leaguesButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            >
              <span className={styles.leagues_label}>
                {t("header.menu.leagues")}


                <Image
                  alt=""
                  src={arrowDown}
                  className={`${styles.arrow} ${showDropdown ? styles.arrowOpen : ""
                    }`}
                  aria-hidden
                />
              </span>
              {showDropdown && (
                <div
                  ref={leaguesDropdownRef}
                  className={styles.leagues_dropdown_mobile}
                  onClick={(e) => e.stopPropagation()}
                >
                  {leaguesData?.map((league) => (
                    <Link
                      key={league.id}
                      href={`/leagues/${league.id}`}
                      className={styles.dropdown_item}
                      onClick={() => setShowDropdown(false)}
                    >
                      {league.name}
                    </Link>
                  ))}
                </div>
              )}
            </span>

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
              <Image src={instagramIcon} alt="" className={styles.instaIcon} />
              <Image src={tiktokIcon} alt="" className={styles.icon} />
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

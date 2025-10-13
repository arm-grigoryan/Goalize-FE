"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.png";
import profileImg from "/public/images/headerProfileImg.png";
import Link from "next/link";
import Button from "@/shared/Button";
import iconSearch from "../../../assets/pngs/icon-search.png";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useTranslations } from "next-intl";
import LanguageSelect from "@/shared/LanguageSelect";
import { useGetLeaguesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import PortalDropdown from "@/shared/PortalDropdown";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import burgerIcon from "../../../assets/pngs/burgerMenu.png";
import closeIcon from "../../../assets/pngs/arrowRightIcon.png";

export const Header = () => {
  const t = useTranslations();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leaguesRef = useRef<HTMLSpanElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { data } = useGetLeaguesQuery();
  const options = data
    ? data.map((league: { id: number; name: string }) => ({
        value: league.id,
        label: league.name,
      }))
    : [];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [mobileMenuOpen]);
  const openMenu = () => {
    setMobileMenuOpen(true);
  };
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  const buttonClick = () => {
    console.log("clicked");
  };

  return (
    <>
      {isMobile ? (
        <>
          {!mobileMenuOpen && (
            <div className={styles.burger_menu_closed}>
              <Image alt="" src={logo} className={styles.logo_wrapper} />
              <Image
                alt=""
                src={burgerIcon}
                className={styles.burger_menu_icon}
                onClick={() => openMenu()}
              />
            </div>
          )}
          {mobileMenuOpen && (
            <div className={styles.mobile_menu_open}>
              <div className={styles.logo_and_close_icon_wrapper}>
                <Image alt="" src={logo} className={styles.logo_wrapper} />
                <Image
                  alt=""
                  src={closeIcon}
                  className={styles.menu_close_icon}
                  onClick={() => closeMenu()}
                />
              </div>
              <div className={styles.menu_wrapper}>
                {showDropdown && leaguesRef.current && (
                  <PortalDropdown
                    options={options}
                    targetRef={leaguesRef}
                    onClose={() => setShowDropdown(false)}
                  />
                )}
                <div className={styles.menu}>
                  <Link
                    href="/"
                    className={styles.link}
                    onClick={() => closeMenu()}
                  >
                    {t("header.menu.home")}
                  </Link>
                  <span
                    className={styles.link}
                    ref={leaguesRef}
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    {t("header.menu.leagues")}
                  </span>

                  <Link
                    href="/teams"
                    className={styles.link}
                    onClick={() => closeMenu()}
                  >
                    {t("header.menu.teams")}
                  </Link>
                  <Link
                    href="/events"
                    className={styles.link}
                    onClick={() => closeMenu()}
                  >
                    {t("header.menu.events")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.header}>
          <Image alt="" src={logo} className={styles.logo_wrapper} />
          <div className={styles.hader_menu}>
            <div className={styles.link_wrapper}>
              <Link href="/" className={styles.link}>
                {t("header.menu.home")}
              </Link>

              <span
                className={styles.link}
                ref={leaguesRef}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {t("header.menu.leagues")}
              </span>

              <Link href="/teams" className={styles.link}>
                {t("header.menu.teams")}
              </Link>
              <Link href="/events" className={styles.link}>
                {t("header.menu.events")}
              </Link>

              {showDropdown && leaguesRef.current && (
                <PortalDropdown
                  options={options}
                  targetRef={leaguesRef}
                  onClose={() => setShowDropdown(false)}
                  width={200}
                />
              )}
            </div>

            <Button
              className="icon_button"
              handleClick={buttonClick}
              icon={iconSearch}
            />
          </div>

          <div className={styles.leng_and_profile_wrapper}>
            <div className={styles.icon_and_leng_wrapper}>
              <LanguageSelect />
            </div>
            <CustomDivider
              variant="fullWidth"
              orientation="vertical"
              flexItem
            />
            <div className={styles.name_and_img_wrapper}>
              <div>
                <span>name surname</span>
              </div>
              <div className={styles.profile_img_wrapper}>
                <Image src={profileImg} alt="" className={styles.profile_img} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

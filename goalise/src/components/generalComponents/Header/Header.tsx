"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.svg";
import profileImg from "/public/images/headerProfileImg.png";
import Link from "next/link";
import searchIcon from '../../../assets/pngs/searchicon.svg';
import { CustomDivider } from "@/shared/Divider/Divider";
import { useTranslations } from "next-intl";
import LanguageSelect from "@/shared/LanguageSelect";
import { useGetLeaguesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import burgerIcon from "../../../assets/pngs/burgerMenu.png";
import closeIcon from "../../../assets/pngs/arrowRightIcon.png";
import { useAuth } from "@/shared/auth/AuthContext";
import notificationIcon from '../../../assets/pngs/notificationIcon.svg';
import SearchCard from "@/shared/SearchCard";
import NotificationCard from "@/shared/NotificationCard";
import PortalDropdown from "@/shared/PortalDropdown";
import { INotificationItemProps } from "@/shared/NotificationItem/NotificationItem.types";
import teamLogo from '../../../assets/pngs/teamLogo.png';
import ProfileCard from "@/shared/ProfileCard";
export const Header = () => {
  const t = useTranslations();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leaguesRef = useRef<HTMLSpanElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: leaguesData } = useGetLeaguesQuery();
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const userLabel = user?.name || user?.email || "Guest";
  
  const obj =[
    { 
      icon: teamLogo,
      title: "New comment on your post", 
      description: "Someone has commented on your recent post."
    },  
    {
      title: "New follower", 
      description: "You have a new follower."
    },
    {
      title: "Update available", 
      description: "A new update is available for your app.",
      acceptButtonText: "Accept",
      denyButtonText: "Deny",
      onAcceptButtonClick: () => {},
      onDenyButtonClick: () => {}
    },
  ] as INotificationItemProps[];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        searchButtonRef.current?.contains(e.target as Node) ||
        searchInputRef.current?.contains(e.target as Node) ||
        notificationRef.current?.contains(e.target as Node)||
        profileRef.current?.contains(e.target as Node)
      ) return;

      setSearchOpen(false);
      setShowSearchInput(false);
      setShowNotifications(false);
      setShowProfileCard(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [mobileMenuOpen]);

  const toggleSearchInput = () => {
    setShowSearchInput(prev => {
      const next = !prev;
      if (next) {
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setSearchOpen(false);
      }
      return next;
    });
  };

  const getReturnPath = () => {
    if (typeof window === "undefined") return "/";
    return `${window.location.pathname}${window.location.search}`;
  };

  const onAuthClick = () => {
    if (isAuthenticated) signOut("/");
    else signIn(getReturnPath());
  };

  return (
    <>
      {isMobile ? (
        <>
          {!mobileMenuOpen && (
            <>
              <div className={styles.burger_menu_closed}>
                <Image alt="" src={logo} className={styles.logo_wrapper} />
                <Image
                  alt=""
                  src={burgerIcon}
                  className={styles.burger_menu_icon}
                  onClick={() => setMobileMenuOpen(true)}
                />
              </div>

              {searchOpen && (
                <SearchCard open={true} inputRef={searchInputRef} />
              )}
            </>
          )}

          {mobileMenuOpen && (
            <div className={styles.mobile_menu_open}>
              <div className={styles.logo_and_close_icon_wrapper}>
                <Image alt="" src={logo} className={styles.logo_wrapper} />
                <Image
                  alt=""
                  src={closeIcon}
                  className={styles.menu_close_icon}
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>

              <div className={styles.menu_wrapper}>
                {showDropdown && leaguesRef.current && (
                  <PortalDropdown
                    options={
                      leaguesData
                        ? leaguesData.map((league) => ({
                            value: league.id,
                            label: league.name,
                          }))
                        : []
                    }
                    targetRef={leaguesRef}
                    onClose={() => setShowDropdown(false)}
                  />
                )}

                <div className={styles.menu}>
                  <Link
                    href="/"
                    className={styles.link}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.menu.home")}
                  </Link>

                  <span
                    className={`${styles.link} ${!!showDropdown ? styles.selected : ""}`}
                    ref={leaguesRef}
                    onClick={() => setShowDropdown(prev => !prev)}
                  >
                    {t("header.menu.leagues")}
                  </span>

                  <Link
                    href="/teams"
                    className={styles.link}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.menu.teams")}
                  </Link>

                  <Link
                    href="/events"
                    className={styles.link}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.menu.events")}
                  </Link>

                  <div className={styles.mobile_auth_actions}>
                    <button
                      className={styles.auth_button}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onAuthClick();
                      }}
                      disabled={loading}
                    >
                      {loading
                        ? "Loading..."
                        : isAuthenticated
                        ? "Sign out"
                        : "Sign in"}
                    </button>
                  </div>
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
                className={styles.sele}
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
                  options={
                    leaguesData
                      ? leaguesData.map((league) => ({
                          value: league.id,
                          label: league.name,
                        }))
                      : []
                  }
                  targetRef={leaguesRef}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.search_wrapper}>
                <div
                  ref={searchButtonRef}
                  className={`${searchOpen ? styles.search_icon_wrapper_open : styles.search_icon_wrapper}`}
                  aria-hidden
                  onClick={toggleSearchInput}
                >
                  <Image alt="" src={searchIcon} />
                </div>
              </div>

              {searchOpen && (
                <div ref={dropdownRef} className={styles.search_dropdown}>
                  <SearchCard open={searchOpen} inputRef={searchInputRef} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.leng_and_profile_wrapper}>
            <div className={styles.icon_and_leng_wrapper} style={{ position: 'relative' }}>
              <div
                className={`${styles.iconWrapper} ${styles.redGlow}`}
                ref={notificationRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(prev => !prev);
                }}
              >
                <Image src={notificationIcon} alt="Notifications" />
              </div>

              {showNotifications && (
                <div
                  className={styles.notification_dropdown}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    zIndex: 1000,
                  }}
                >
                  <NotificationCard object={obj}/>
                </div>
              )}

              <LanguageSelect />
            </div>

            <CustomDivider variant="fullWidth" orientation="vertical" flexItem />

            <div className={`${showProfileCard && styles.img_selected} ${ styles.name_and_img_wrapper}`}
              ref={profileRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileCard(prev => !prev);
                }}>
              <div className={styles.profile_details}>
                <span className={styles.user_name}>{userLabel}</span>
              </div>

              <div
                className={styles.profile_img_wrapper }>
                <Image src={profileImg} alt="" className={styles.profile_img} />
              </div>
                {showProfileCard && (
                    <div className={styles.profile_dropdown}>
                      <ProfileCard  />
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

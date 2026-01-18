"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.svg";
import profileImg from "/public/images/headerProfileImg.png";
import Link from "next/link";
import searchIcon from "../../../assets/pngs/searchicon.svg";
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
import notificationIcon from "../../../assets/pngs/notificationIcon.svg";
import SearchCard from "@/shared/SearchCard";
import NotificationCard from "@/shared/NotificationCard";
import PortalDropdown from "@/shared/PortalDropdown";
import { INotificationItemProps } from "@/shared/NotificationItem/NotificationItem.types";
import teamLogo from "../../../assets/pngs/teamLogo.png";
import ProfileCard from "@/shared/ProfileCard";
import mobileLogo from "/public/pngs/logo/mobileLogo.svg";
export const Header = () => {
  const t = useTranslations();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leaguesRef = useRef<HTMLSpanElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: leaguesData } = useGetLeaguesQuery();
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();

  const [, setShowSearchInput] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const userLabel = user?.name || user?.email || "Guest";

  const obj = [
    {
      icon: teamLogo,
      title: "New comment on your post",
      description: "Someone has commented on your recent post.",
    },
    {
      title: "New follower",
      description: "You have a new follower.",
    },
    {
      title: "Update available",
      description: "A new update is available for your app.",
      acceptButtonText: "Accept",
      denyButtonText: "Deny",
      onAcceptButtonClick: () => {},
      onDenyButtonClick: () => {},
    },
  ] as INotificationItemProps[];
  const notificationsCount = obj.length;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        searchButtonRef.current?.contains(e.target as Node) ||
        mobileSearchRef.current?.contains(e.target as Node) ||
        searchInputRef.current?.contains(e.target as Node) ||
        notificationRef.current?.contains(e.target as Node) ||
        profileRef.current?.contains(e.target as Node)
      )
        return;

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
    setShowSearchInput((prev) => {
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
            <div className={styles.header_mobile}>
              <div className={styles.imagesWrapper}> 
                  <Image
                    alt=""
                    src={burgerIcon}
                    className={styles.burger_menu_icon}
                    onClick={() => setMobileMenuOpen(true)}
                  />
                   <Image
                      alt=""
                      src={mobileLogo}
                      className={styles.mobile_logo_wrapper}
                  />
              </div>
              <div className={styles.burger_menu_closed}>
                <div className={styles.leng_and_profile_wrapper_mobile}>
                   <div
                    className={`${styles.iconWrapper} ${styles.redGlow}`}
                    ref={mobileSearchRef}
                    onClick={toggleSearchInput}
                  >
                    <Image alt="" src={searchIcon} className={styles.searchIcon} />
                  </div>
                  {isAuthenticated && (
                    <>
                      <div
                        className={`${styles.iconWrapper} ${styles.redGlow}`}
                        ref={notificationRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotifications((prev) => {
                            if (!prev) setShowProfileCard(false);
                            return !prev;
                          });
                        }}
                      >
                        <Image src={notificationIcon} alt="Notifications" />
                        {notificationsCount > 0 && (
                          <span className={styles.notificationBadge}>
                            {notificationsCount > 99
                              ? "99+"
                              : notificationsCount}
                          </span>
                        )}
                      </div>
                     
                      {showNotifications && (
                        <div className={styles.notification_dropdown_mobile}>
                          <NotificationCard object={obj} />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {isAuthenticated ? (
              <div
                className={`${
                  styles.name_and_img_wrapper
                }`}
                ref={profileRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileCard((prev) => {
                    if (!prev) setShowNotifications(false);
                    return !prev;
                  });
                }}
              >
                <div>
                  <Image
                    src={profileImg}
                    alt=""
                    className={styles.profile_img}
                  />
                </div>
                {showProfileCard && (
                  <div className={styles.profile_dropdown_mobile}>
                    <ProfileCard
                      logIn={isAuthenticated}
                      onAuthClick={onAuthClick}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                className={styles.auth_button}
                onClick={onAuthClick}
                disabled={loading}
              >
                {loading ? "Loading..." : t("home.profileCard.logIn")}
              </button>
            )}
              </div>
              {searchOpen && (
                <SearchCard open={searchOpen} inputRef={searchInputRef} />
              )}
            </div>
          )}
          {mobileMenuOpen && (
            <div className={styles.mobile_menu_open}>
              <div className={styles.logo_and_close_icon_wrapper}>
                <Image alt="" src={mobileLogo} className={styles.logo_wrapper} />
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
                    className={`${styles.link} ${
                      !!showDropdown ? styles.selected : ""
                    }`}
                    ref={leaguesRef}
                    onClick={() => setShowDropdown((prev) => !prev)}
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
                  <LanguageSelect variant="headerMobile"/>
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
              <div className={styles.iconWrapper} ref={searchButtonRef}>
                <div
                  className={
                    searchOpen
                      ? styles.search_icon_wrapper_open
                      : styles.search_icon_wrapper
                  }
                  onClick={toggleSearchInput}
                >
                  <Image alt="" src={searchIcon} />
                </div>
                <div
                  ref={dropdownRef}
                  className={`${styles.search_dropdown} ${
                    searchOpen ? styles.open : styles.closed
                  }`}
                >
                  <SearchCard open={searchOpen} inputRef={searchInputRef} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.leng_and_profile_wrapper}>
            <div
              className={styles.icon_and_leng_wrapper}
              style={{ position: "relative" }}
            >
              {isAuthenticated && (
                <>
                  <div
                    className={`${styles.iconWrapper} ${styles.redGlow}`}
                    ref={notificationRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications((prev) => {
                        if (!prev) setShowProfileCard(false);
                        return !prev;
                      });
                    }}
                  >
                    <Image src={notificationIcon} alt="Notifications" />
                    {notificationsCount > 0 && (
                      <span className={styles.notificationBadge}>
                        {notificationsCount > 99 ? "99+" : notificationsCount}
                      </span>
                    )}
                  </div>

                  {showNotifications && (
                    <div className={styles.notification_dropdown}>
                      <NotificationCard object={obj} />
                    </div>
                  )}
                </>
              )}

              <LanguageSelect />
            </div>

            <CustomDivider
              variant="fullWidth"
              orientation="vertical"
              flexItem
            />

            {isAuthenticated ? (
              <div
                className={`${showProfileCard && styles.img_selected} ${
                  styles.name_and_img_wrapper
                }`}
                ref={profileRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileCard((prev) => {
                    if (!prev) setShowNotifications(false);
                    return !prev;
                  });
                }}
              >
                <div className={styles.profile_details}>
                  <span className={styles.user_name}>{userLabel}</span>
                </div>

                <div className={styles.profile_img_wrapper}>
                  <Image
                    src={profileImg}
                    alt=""
                    className={styles.profile_img}
                  />
                </div>
                {showProfileCard && (
                  <div className={styles.profile_dropdown}>
                    <ProfileCard
                      logIn={isAuthenticated}
                      onAuthClick={onAuthClick}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                className={styles.auth_button}
                onClick={onAuthClick}
                disabled={loading}
              >
                {loading ? "Loading..." : t("home.profileCard.logIn")}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

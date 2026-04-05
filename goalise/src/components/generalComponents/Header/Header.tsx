"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "../../../../public/pngs/logo/Logo.svg";
import noPhoto from "../../../assets/pngs/noPhoto.png";
import Link from "next/link";
import searchIcon from "../../../assets/pngs/searchicon.svg";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useTranslations } from "next-intl";
import LanguageSelect from "@/shared/LanguageSelect";
import { useGetLeaguesQuery } from "@/app/store/services/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import burgerIcon from "../../../assets/pngs/burgerMenu.png";
import closeIcon from "../../../assets/pngs/arrowRightIcon.png";
import { useAuth } from "@/shared/auth/AuthContext";
import notificationIcon from "../../../assets/pngs/notificationIcon.svg";
import SearchCard from "@/shared/SearchCard";
import NotificationCard from "@/shared/NotificationCard";
import PortalDropdown from "@/shared/PortalDropdown";
import ProfileCard from "@/shared/ProfileCard";
import mobileLogo from "../../../../public/pngs/logo/mobileLogo.svg";
import { ErrorBanner } from "@/components/ErrorBanner/ErrorBanner";
import arrowDown from "../../../assets/pngs/arrowDown.svg";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationPopUp } from "@/entities/NotificationPopUp/NotificationPopUp";
import CreateTeamPopUp from "@/entities/CreateTeamPopUp";

type ActiveDropdown = "search" | "notifications" | "profile" | "leagues" | null;

export const Header = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leaguesRef = useRef<HTMLSpanElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchCardRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const leaguesButtonRef = useRef<HTMLSpanElement>(null);
  const leaguesDropdownRef = useRef<HTMLDivElement>(null);

  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: leaguesData } = useGetLeaguesQuery();
  const { isAuthenticated, user, signIn, signOut, loading, tokens } = useAuth();
  const {
    notifications,
    unseenCount,
    hasMore,
    isFetching,
    toastNotification,
    loadMore,
    onBellOpen,
    closeToast,
    toPresentation,
    decideFlow,
  } = useNotifications(tokens?.accessToken);

  const profileRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => setActiveDropdown(null), []);
  const closeNotifications = useCallback(() => setActiveDropdown(null), []);
  const closeProfile = useCallback(() => setActiveDropdown(null), []);
  const closeLeagues = useCallback(() => setActiveDropdown(null), []);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const handleCreateTeamClick = useCallback(() => {
    setActiveDropdown(null);
    setCreateTeamOpen(true);
  }, []);

  useOnClickOutside([searchContainerRef, mobileSearchCardRef], closeSearch, activeDropdown === "search");
  useOnClickOutside([notificationRef, notificationDropdownRef], closeNotifications, activeDropdown === "notifications");
  useOnClickOutside([profileRef], closeProfile, activeDropdown === "profile");
  useOnClickOutside([leaguesRef, leaguesButtonRef, leaguesDropdownRef], closeLeagues, activeDropdown === "leagues");

  const userLabel = user?.name || user?.email || "Guest";
  const profileImg = user?.picture || noPhoto;


  useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [mobileMenuOpen]);

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  const toggleSearchInput = () => {
    setActiveDropdown((prev: ActiveDropdown) => {
      const next = prev === "search" ? null : "search";
      if (next === "search") {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return next;
    });
  };

  const onAuthClick = () => {
    if (isAuthenticated) signOut("/");
    else signIn();
  };

  return (
    <>
      {toastNotification &&
        (() => {
          const presentation = toPresentation(toastNotification);
          return (
            <div
              className={styles.toastWrapper}
              onClick={() => {
                setActiveDropdown("notifications");
                closeToast();
                void onBellOpen();
              }}
            >
              <NotificationPopUp {...presentation} />
            </div>
          );
        })()}
      {isMobile ? (
        <>
          {!mobileMenuOpen && (
            <div className={styles.header_mobile} style={{ position: "relative" }}>
              <div className={styles.imagesWrapper}>
                <Image
                  alt=""
                  src={burgerIcon}
                  className={styles.burger_menu_icon}
                  onClick={() => setMobileMenuOpen(true)}
                />
                <Link href="/">
                  <Image
                    alt="Logo"
                    src={mobileLogo}
                    className={styles.mobile_logo_wrapper}
                  />
                </Link>
              </div>
              <div className={styles.burger_menu_closed}>
                <div className={styles.leng_and_profile_wrapper_mobile}>
                  <div
                    ref={searchContainerRef}
                    className={`${styles.iconWrapper} ${styles.redGlow}`}
                    onClick={toggleSearchInput}
                  >
                    <Image
                      alt=""
                      src={searchIcon}
                      className={styles.searchIcon}
                    />
                  </div>
                  {isAuthenticated && (
                    <>
                      <div
                        className={`${styles.iconWrapper} ${styles.redGlow}`}
                        ref={notificationRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown((prev: ActiveDropdown) => {
                            const next =
                              prev === "notifications" ? null : "notifications";
                            if (next === "notifications") {
                              void onBellOpen();
                            }
                            return next;
                          });
                        }}
                      >
                        <Image src={notificationIcon} alt="Notifications" />
                        {unseenCount > 0 && (
                          <span className={styles.notificationBadge}>
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </span>
                        )}
                      </div>

                      {activeDropdown === "notifications" && (
                        <div ref={notificationDropdownRef} className={styles.notification_dropdown_mobile}>
                          <NotificationCard
                            object={notifications.map((item) => {
                              const presentation = toPresentation(item);
                              const canRespond =
                                Boolean(item.notificationRelatedFlowType) &&
                                Boolean(item.notificationRelatedFlowId) &&
                                !item.flowCompleted;

                              return {
                                id: item.id,
                                ...presentation,
                                acceptButtonText: canRespond
                                  ? t("home.notifications.accept")
                                  : undefined,
                                denyButtonText: canRespond
                                  ? t("home.notifications.deny")
                                  : undefined,
                                onAcceptButtonClick: canRespond
                                  ? () => void decideFlow(item, "Accepted")
                                  : undefined,
                                onDenyButtonClick: canRespond
                                  ? () => void decideFlow(item, "Rejected")
                                  : undefined,
                              };
                            })}
                            loading={isFetching}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                          />
                        </div>
                      )}
                    </>
                  )}
                  <ErrorBanner visible={false} onClose={() => { }} />
                  {isAuthenticated ? (
                    <div
                      className={`${styles.name_and_img_wrapper}`}
                      ref={profileRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown((prev: ActiveDropdown) => {
                          return prev === "profile" ? null : "profile";
                        });
                      }}
                    >
                      <div>
                        <Image
                          src={profileImg}
                          alt=""
                          width={40}
                          className={styles.profile_img}
                        />
                      </div>
                      {activeDropdown === "profile" && (
                        <div className={styles.profile_dropdown_mobile}>
                          <ProfileCard
                            logIn={isAuthenticated}
                            onAuthClick={onAuthClick}
                            onCreateTeamClick={handleCreateTeamClick}
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
              {activeDropdown === "search" && (
                <div
                  ref={mobileSearchCardRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    height: 0,
                    overflow: "visible",
                    zIndex: 9999,
                  }}
                >
                  <SearchCard
                    open={activeDropdown === "search"}
                    inputRef={searchInputRef}
                  />
                </div>
              )}
            </div>
          )}
          {mobileMenuOpen && (
            <div className={styles.mobile_menu_open}>
              <div className={styles.logo_and_close_icon_wrapper}>
                <Link href="/">
                  <Image
                    alt="Logo"
                    src={mobileLogo}
                    className={styles.mobile_logo_wrapper}
                  />
                </Link>
                <Image
                  alt=""
                  src={closeIcon}
                  className={styles.menu_close_icon}
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>

              <div className={styles.menu_wrapper}>
                {activeDropdown === "leagues" && leaguesRef.current && (
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
                    onClose={() => setActiveDropdown(null)}
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
                    className={`${styles.leagues_mobile} ${activeDropdown === "leagues" ? styles.active : ""
                      }`}
                    ref={leaguesButtonRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown((prev: ActiveDropdown) =>
                        prev === "leagues" ? null : "leagues",
                      );
                    }}
                  >
                    <span className={styles.leagues_label}>
                      {t("header.menu.leagues")}
                    </span>

                    <Image
                      alt=""
                      src={arrowDown}
                      className={`${styles.arrow} ${activeDropdown === "leagues" ? styles.arrowOpen : ""
                        }`}
                      aria-hidden
                    />

                    {activeDropdown === "leagues" && (
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
                            onClick={() => {
                              setMobileMenuOpen(false);
                            }}
                          >
                            {league.name}
                          </Link>
                        ))}
                      </div>
                    )}
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
                  <LanguageSelect variant="headerMobile" />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.header}>
          <Link href="/">
            <Image alt="Logo" src={logo} className={styles.logo_wrapper} />
          </Link>

          <div className={styles.hader_menu}>
            <div className={styles.link_wrapper}>
              <Link href="/" className={styles.link}>
                {t("header.menu.home")}
              </Link>

              <span
                className={styles.sele}
                ref={leaguesRef}
                onClick={() =>
                  setActiveDropdown((prev: ActiveDropdown) =>
                    prev === "leagues" ? null : "leagues",
                  )
                }
              >
                {t("header.menu.leagues")}
              </span>

              <Link href="/teams" className={styles.link}>
                {t("header.menu.teams")}
              </Link>
              <Link href="/events" className={styles.link}>
                {t("header.menu.events")}
              </Link>
              {activeDropdown === "leagues" && leaguesRef.current && (
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
                  onClose={() => setActiveDropdown(null)}
                />
              )}
            </div>

            <div className={styles.searchContainer} ref={searchContainerRef}>
              <div className={styles.iconWrapper}>
                <div
                  className={
                    activeDropdown === "search"
                      ? styles.search_icon_wrapper_open
                      : styles.search_icon_wrapper
                  }
                  onClick={toggleSearchInput}
                >
                  <Image alt="" src={searchIcon} />
                </div>
                <div
                  className={`${styles.search_dropdown} ${activeDropdown === "search" ? styles.open : styles.closed
                    }`}
                >
                  <SearchCard
                    open={activeDropdown === "search"}
                    inputRef={searchInputRef}
                  />
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
                      setActiveDropdown((prev: ActiveDropdown) => {
                        const next =
                          prev === "notifications" ? null : "notifications";
                        if (next === "notifications") {
                          void onBellOpen();
                        }
                        return next;
                      });
                    }}
                  >
                    <Image src={notificationIcon} alt="Notifications" />
                    {unseenCount > 0 && (
                      <span className={styles.notificationBadge}>
                        {unseenCount > 99 ? "99+" : unseenCount}
                      </span>
                    )}
                  </div>

                  {activeDropdown === "notifications" && (
                    <div ref={notificationDropdownRef} className={styles.notification_dropdown}>
                      <NotificationCard
                        object={notifications.map((item) => {
                          const presentation = toPresentation(item);
                          const canRespond =
                            Boolean(item.notificationRelatedFlowType) &&
                            Boolean(item.notificationRelatedFlowId) &&
                            !item.flowCompleted;

                          return {
                            id: item.id,
                            ...presentation,
                            acceptButtonText: canRespond
                              ? t("home.notifications.accept")
                              : undefined,
                            denyButtonText: canRespond
                              ? t("home.notifications.deny")
                              : undefined,
                            onAcceptButtonClick: canRespond
                              ? () => void decideFlow(item, "Accepted")
                              : undefined,
                            onDenyButtonClick: canRespond
                              ? () => void decideFlow(item, "Rejected")
                              : undefined,
                          };
                        })}
                        loading={isFetching}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                      />
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
            <ErrorBanner visible={false} onClose={() => { }} />
            {isAuthenticated ? (
              <div
                className={`${activeDropdown === "profile" && styles.img_selected} ${styles.name_and_img_wrapper
                  }`}
                ref={profileRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown((prev: ActiveDropdown) => {
                    return prev === "profile" ? null : "profile";
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
                    width={40}
                    height={40}
                    className={styles.profile_img}
                  />
                </div>
                {activeDropdown === "profile" && (
                  <div className={styles.profile_dropdown}>
                    <ProfileCard
                      logIn={isAuthenticated}
                      onAuthClick={onAuthClick}
                      onCreateTeamClick={handleCreateTeamClick}
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
      <CreateTeamPopUp
        open={createTeamOpen}
        onClose={() => setCreateTeamOpen(false)}
      />
    </>
  );
};

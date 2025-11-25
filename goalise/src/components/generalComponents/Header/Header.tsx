"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.svg";
import profileImg from "/public/images/headerProfileImg.png";
import Link from "next/link";
import iconSearch from "../../../assets/pngs/icon-search.png";
import { CustomDivider } from "@/shared/Divider/Divider";
import { useTranslations } from "next-intl";
import LanguageSelect from "@/shared/LanguageSelect";
import { useGetLeaguesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState, useMemo } from "react";
import PortalDropdown from "@/shared/PortalDropdown";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import burgerIcon from "../../../assets/pngs/burgerMenu.png";
import closeIcon from "../../../assets/pngs/arrowRightIcon.png";
import { useAuth } from "@/shared/auth/AuthContext";

export const Header = () => {
  const t = useTranslations();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leaguesRef = useRef<HTMLSpanElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data: leaguesData, isLoading: leaguesLoading } = useGetLeaguesQuery();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const filteredLeagues = useMemo(() => {
    if (!debouncedQuery) return [];
    if (!leaguesData) return [];
    const q = debouncedQuery.toLowerCase();
    return leaguesData.filter((l) => l.name.toLowerCase().includes(q));
  }, [debouncedQuery, leaguesData]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(e.target as Node) ||
        (searchInputRef.current &&
          searchInputRef.current.contains(e.target as Node)) ||
        (searchButtonRef.current &&
          searchButtonRef.current.contains(e.target as Node))
      )
        return;
      setSearchOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

  const openMenu = () => setMobileMenuOpen(true);
  const closeMenu = () => setMobileMenuOpen(false);

  const onSearchFocus = () => {
    if (filteredLeagues.length > 0) setSearchOpen(true);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) setSearchOpen(true);
    else setSearchOpen(false);
  };

  const onSelectLeague = () => {
    setQuery("");
    setDebouncedQuery("");
    setSearchOpen(false);
    setShowSearchInput(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredLeagues.length > 0) {
      const first = filteredLeagues[0];
      window.location.href = `/leagues/${first.id}`;
      onSelectLeague();
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setShowSearchInput(false);
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setQuery("");
        setDebouncedQuery("");
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
    if (isAuthenticated) {
      signOut("/");
    } else {
      signIn(getReturnPath());
    }
  };

  const userLabel =
    user?.name || user?.email || "Guest";

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

                  <div className={styles.mobile_search_wrapper}>
                    <input
                      ref={searchInputRef}
                      value={query}
                      onChange={onSearchChange}
                      onFocus={onSearchFocus}
                      onKeyDown={onKeyDown}
                      placeholder={"Search leagues..."}
                      aria-label="Search leagues"
                      className={styles.mobile_search_input}
                    />
                    {searchOpen && (
                      <div
                        ref={dropdownRef}
                        className={styles.search_dropdown_mobile}
                      >
                        {leaguesLoading && (
                          <div className={styles.search_loading}>
                            Loading...
                          </div>
                        )}

                        {!leaguesLoading && filteredLeagues.length === 0 && (
                          <div className={styles.search_no_results}>
                            No results
                          </div>
                        )}

                        {!leaguesLoading &&
                          filteredLeagues.map((l) => (
                            <Link
                              key={l.id}
                              href={`/leagues/${l.id}`}
                              className={styles.search_item}
                              onClick={onSelectLeague}
                            >
                              {l.name}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.mobile_auth_actions}>
                    <button
                      className={styles.auth_button}
                      onClick={() => {
                        closeMenu();
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
                  width={200}
                />
              )}
            </div>

            <div className={styles.search_wrapper}>
              <div
                ref={searchButtonRef}
                className={styles.search_icon_wrapper}
                aria-hidden
                onClick={toggleSearchInput}
              >
                <Image alt="" src={iconSearch} />
              </div>

              <input
                ref={searchInputRef}
                className={`${styles.search_input} ${
                  showSearchInput
                    ? styles.search_input_open
                    : styles.search_input_closed
                }`}
                placeholder={"Search leagues..."}
                aria-label="Search leagues"
                value={query}
                onChange={onSearchChange}
                onFocus={onSearchFocus}
                onKeyDown={onKeyDown}
                onClick={(e) => e.stopPropagation()}
              />

              {searchOpen && (
                <div ref={dropdownRef} className={styles.search_dropdown}>
                  {leaguesLoading && (
                    <div className={styles.search_loading}>Loading...</div>
                  )}

                  {!leaguesLoading && filteredLeagues.length === 0 && (
                    <div className={styles.search_no_results}>No results</div>
                  )}

                  {!leaguesLoading &&
                    filteredLeagues.map((l) => (
                      <Link
                        key={l.id}
                        href={`/leagues/${l.id}`}
                        className={styles.search_item}
                        onClick={onSelectLeague}
                      >
                        <div className={styles.search_item_label}>{l.name}</div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
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
              <div className={styles.profile_details}>
                <span className={styles.user_name}>{userLabel}</span>
                <button
                  className={styles.auth_button}
                  onClick={onAuthClick}
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : isAuthenticated
                      ? "Sign out"
                      : "Sign in"}
                </button>
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

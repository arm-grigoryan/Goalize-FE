import { ISearchCardProps } from "./SearchCard.types";
import styles from "./SearchCard.module.css";
import { useSearchAutoComplete } from "@/hooks/useSearchAutoComplete";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import redSearchIcon from "../../assets/pngs/redSearchIcon.svg";

export const SearchCard: React.FC<ISearchCardProps> = ({ open, inputRef }) => {
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const {
    results,
    isLoading: searchLoading,
    activeTab,
    setActiveTab,
  } = useSearchAutoComplete(query);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getRouteByType = (type: string, id: string | number): string => {
    switch (type) {
      case 'league':
        return `/leagues/${id}`;
      case 'team':
        return `/teams/${id}`;
      case 'player':
        return `/profile/${id}`;
      default:
        return `/profile/${id}`;
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <>
      <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div className={styles.searchInputWrapper}>
          <Image
            src={redSearchIcon}
            alt="search"
            className={styles.searchIcon}
          />

          <input
            ref={inputRef}
            className={`${styles.search_input} ${open ? styles.search_input_open : styles.search_input_closed
              }`}
            placeholder="Search leagues, teams, players..."
            value={query}
            onChange={onSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div
          ref={dropdownRef}
          className={`${styles.search_dropdown} ${open ? styles.open : styles.closed
            }`}
        >
          {!searchLoading && results && (
            <div className={styles.search}>
              <div className={styles.search_tabs}>
                <button
                  className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""
                    }`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "leagues" ? styles.activeTab : ""
                    }`}
                  onClick={() => setActiveTab("leagues")}
                >
                  Leagues
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "teams" ? styles.activeTab : ""
                    }`}
                  onClick={() => setActiveTab("teams")}
                >
                  Teams
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "players" ? styles.activeTab : ""
                    }`}
                  onClick={() => setActiveTab("players")}
                >
                  Players
                </button>
              </div>
            </div>
          )}

          {!searchLoading && (
            <div className={styles.search_item_container}>
              {(
                activeTab === "all"
                  ? results?.all ?? []
                  : activeTab === "leagues"
                    ? results?.leagues ?? []
                    : activeTab === "teams"
                      ? results?.teams ?? []
                      : results?.players ?? []
              ).map((it) => (
                <Link
                  key={`${it.type}-${it.id}`}
                  href={getRouteByType(it.type, it.id)}
                  className={styles.search_item}
                >
                  {it.pictureUrl && isValidUrl(it.pictureUrl) && (
                    <Image
                      src={it.pictureUrl}
                      alt={it.mainText}
                      width={32}
                      height={32}
                      className={styles.search_item_image}
                    />
                  )}
                  <div className={styles.search_item_content}>
                    <div className={styles.search_item_label}>
                      {it.mainText}
                    </div>

                    {it.secondaryText && (
                      <div className={styles.search_item_secondary}>
                        {it.secondaryText}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {searchLoading && (
            <div className={styles.search_loading}>Loading...</div>
          )}

          {!searchLoading &&
            (
              activeTab === "all"
                ? results?.all ?? []
                : activeTab === "leagues"
                  ? results?.leagues ?? []
                  : activeTab === "teams"
                    ? results?.teams ?? []
                    : results?.players ?? []
            ).length === 0 && (
              <div className={styles.search_no_results}>No results</div>
            )}
        </div>
      </div>
    </>
  );
};

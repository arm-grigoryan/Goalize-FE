import { ISearchCardProps } from "./SearchCard.types";
import styles from './SearchCard.module.css';
import { useSearchAutoComplete } from "@/hooks/useSearchAutoComplete";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useGetLeaguesQuery } from "@/app/store/services/api";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import redSearchIcon from '../../assets/pngs/redSearchIcon.svg';

export const SearchCard: React.FC<ISearchCardProps> = ({ open, inputRef }) => {
  const [query, setQuery] = useState("");
  // const [searchOpen, setSearchOpen] = useState(false)
  // const { data: leaguesData } = useGetLeaguesQuery();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //  const renderHighlighted = (text: string, q: string) => {
  //   if (!q) return text;
  //   try {
  //     const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  //     return parts.map((part, i) =>
  //       part.toLowerCase() === q.toLowerCase() ? (
  //         <span key={i} className={styles.search_highlight}>
  //           {part}
  //         </span>
  //       ) : (
  //         <span key={i} className={styles.search_dim}>
  //           {part}
  //         </span>
  //       )
  //     );
  //   } catch {
  //     return text;
  //   }
  // };
  const {
    results,
    isLoading: searchLoading,
    activeTab,
    setActiveTab,
  } = useSearchAutoComplete(query);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <>
      {isMobile && 
     <div className={styles.search_mobile_container}>
          <div className={styles.input_image_wrapper}> 
                <Image src={redSearchIcon} alt=""/>
                <input 
                  ref={inputRef}
                  placeholder="Search leagues..." 
                  className={`${styles.search_input_mobile} ${
                        open ? styles.search_input_open : styles.search_input_closed
                }`}
                value={query}
                onChange={onSearchChange}
                onClick={(e) => e.stopPropagation()}
                />
          </div>
      </div> 
      } 
      
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div className={styles.searchInputWrapper}>
          <Image
            src={redSearchIcon}
            alt="search"
            className={styles.searchIcon}
          />

          <input
            ref={inputRef}
            className={`${styles.search_input} ${
              open ? styles.search_input_open : styles.search_input_closed
            }`}
            placeholder="Search leagues..."
            value={query}
            onChange={onSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      {open && (
        <div ref={dropdownRef} className={styles.search_dropdown}>
             {!searchLoading && results && (
                    <div className={styles.search}>
                      <div className={styles.search_tabs}>
                        <button
                          className={`${styles.tab} ${
                            activeTab === "all" ? styles.activeTab : ""
                          }`}
                          onClick={() => setActiveTab("all")}
                        >
                          All
                        </button>
                        <button
                          className={`${styles.tab} ${
                            activeTab === "leagues" ? styles.activeTab : ""
                          }`}
                          onClick={() => setActiveTab("leagues")}
                        >
                          Leagues
                        </button>
                        <button
                          className={`${styles.tab} ${
                            activeTab === "teams" ? styles.activeTab : ""
                          }`}
                          onClick={() => setActiveTab("teams")}
                        >
                          Teams
                        </button>
                        <button
                          className={`${styles.tab} ${
                            activeTab === "players" ? styles.activeTab : ""
                          }`}
                          onClick={() => setActiveTab("players")}
                        >
                          Players
                        </button>
                      </div>
                      {/* <div className={styles.search_list}>
                        {(
                            activeTab === "all"
                              ? results?.all ?? []
                              : activeTab === "leagues"
                              ? results?.leagues ?? []
                              : activeTab === "teams"
                              ? results?.teams ?? []
                              : results?.players ?? []
                          ).map((it: SearchItem) => {
                          const href =
                            it.type === "league"
                              ? `/leagues/${it.id}`
                              : it.type === "team"
                              ? `/teams/${it.id}`
                              : `/profile/${it.id}`;
                          return (
                            <Link
                              key={`${it.type}-${it.id}`}
                              href={href}
                              className={styles.search_item}
                              onClick={() => {
                                setQuery("");
                                setSearchOpen(false);
                              }}
                            >
                              <div className={styles.search_item_content}>
                                <div className={styles.search_item_label}>
                                  {renderHighlighted(it.mainText, query)}
                                </div>
                                {it.secondaryText && (
                                  <div className={styles.search_item_secondary}>
                                    {it.secondaryText}
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div> */}
                    </div>
                  )}
          {!searchLoading &&
            <div className={styles.search_item_container}>  
            {results?.all?.map((it) => (
              <Link
                key={`${it.type}-${it.id}`}
                href={
                  it.type === "league"
                    ? `/leagues/${it.id}`
                    : it.type === "team"
                    ? `/teams/${it.id}`
                    : `/profile/${it.id}`
                }
                className={styles.search_item}
              >
                {it.pictureUrl && (
                  <Image
                    src={it.pictureUrl}
                    alt={it.mainText}
                    width={32}
                    height={32}
                    className={styles.search_item_image}
                  />
                )}
                <div className={styles.search_item_content}>
                  <div className={styles.search_item_label}>{it.mainText}</div>

                  {it.secondaryText && (
                    <div className={styles.search_item_secondary}>
                      {it.secondaryText}
                    </div>
                  )}
                </div>
              </Link>
            )
            )}
              </div>
            }
             {searchLoading && <div className={styles.search_loading}>Loading...</div>}

          {!searchLoading && results?.all?.length === 0 && (
            <div className={styles.search_no_results}>No results</div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

"use client";
import styles from "./HomeUpcomingMatchesCard.module.css";
import Title from "@/shared/Title";
import Image from "next/image";
import vsIcon from "../../assets/pngs/vsIcon.png";
import teamLogoLeft from "../../assets/pngs/teamLoroLeft.png";
import teamLogoRight from "../../assets/pngs/teamLogoRight.png";
import MatchListInnerCard from "@/entities/MatchListInnerCard";
import { useGetUpComingMatchesQuery } from "@/app/store/services/api";
import CustomDivider from "@/shared/Divider";
import { useEffect, useRef, useState } from "react";
import { UpcomingMatch } from "@/types/api/upComingMatches";
import { useTranslations } from "next-intl";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import upcomingEmpty from "../../assets/pngs/upcomingEmpty.svg";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import matchMobileEmpty from "../../assets/pngs/matchMobileEmpty.svg";
import { LiveDateLabel } from "@/entities/LiveDateLabel/LiveDateLabel";

export const HomeUpcomingMatchesCard = () => {
  const t = useTranslations();
  const BATCH_SIZE = 10;
  const [offset, setOffset] = useState<number>(0);
  const [allMatches, setAllMatches] = useState<UpcomingMatch[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data, isFetching } = useGetUpComingMatchesQuery(
    { take: BATCH_SIZE, skip: offset },
    { skip: !hasMore }
  );

  // Data processing effect: Append unique items and update hasMore
  useEffect(() => {
    if (!data) return;

    setAllMatches((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newUnique = data.filter((m) => !existingIds.has(m.id));
      return [...prev, ...newUnique];
    });

    if (data.length < BATCH_SIZE) {
      setHasMore(false);
    }
  }, [data]);

  // Infinite Scroll Handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Prevent multiple triggers or fetching when done
      if (isFetching || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Trigger update when close to bottom
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setOffset((prev) => prev + BATCH_SIZE);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore, allMatches]);

  // Initial fill effect: If content doesn't overflow, fetch more until it does
  useEffect(() => {
    if (!hasMore || isFetching || allMatches.length === 0) return;

    const container = scrollContainerRef.current;
    if (container && container.scrollHeight <= container.clientHeight) {
      setOffset((prev) => prev + BATCH_SIZE);
    }
  }, [allMatches, hasMore, isFetching]);

  // Derived state for UI
  const firstMatch = allMatches[0]; // Featured item
  const matches = allMatches.slice(1); // Scrollable list

  return (
    <>
      {!allMatches?.length ? (
        <div className={styles.Home_main_card_no_mutch}>
          <div className={styles.no_upcoming_wrapper}>
            <Image
              src={isMobile ? matchMobileEmpty : upcomingEmpty}
              alt=""
              className={styles.no_upcoming_image}
            />
            <span className={styles.no_upcoming_text}>
              No upcoming matches scheduled at the moment
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.Home_main_card}>
          <div className={styles.match_inner_wrapper}>
            <div>
              {/* <LiveDateLabel isLive/>
              <div
                className={`${styles.title} ${isMobile && styles.title_mobile}`}
              >
                <div className={styles.title_text}>
                  {t("home.upcomingMatches.title")}
                </div>
              </div> */}
              <LiveDateLabel date="25-06-25" time="10:25" />
            </div>
            <div className={styles.leftRightWrapper}> 
            <div className={styles.match_left_block}>
              <div className={styles.match_left_block_inner_wrapper}>
                <div>
                  <span className={styles.team_name}>
                    {firstMatch?.homeTeam?.name}
                  </span>
                </div>
                <Image src={teamLogoLeft} alt="" className={styles.team_logo} />
              </div>
            </div>
            <div>
              <Image src={vsIcon} alt="Upcoming Match" />
            </div>
            <div className={styles.match_right_block}>
              <div className={styles.match_right_block_inner_wrapper}>
                <div>
                  <span className={styles.team_name}>
                    {firstMatch?.awayTeam?.name}
                  </span>
                </div>
                <Image
                  src={teamLogoRight}
                  alt=""
                  className={styles.team_logo}
                />
              </div>
            </div>
          </div>
          </div>
          
          <div className={styles.divider}>
            <CustomDivider orientation="vertical" />
          </div>
          <div className={styles.next_match_list_wrapper}>
            <div className={styles.title_and_day_wrapper}>
              <Title content={t("home.upcomingMatches.matchList")} />
            </div>
            <div
              ref={scrollContainerRef}
              className={styles.next_matches_list_inner_wrapper}
            >
              {matches.map((match) => {
                return (
                  <MatchListInnerCard
                    key={match.id}
                    teamNameHome={match.homeTeam.name}
                    homeTeamPoints={match.homeTeamPoints}
                    teamNameAway={match.awayTeam.name}
                    awayTeamPoints={match.awayTeamPoints}
                    matchDate={formatUTCDate(match.date)}
                    matchTime={formatUTCDate(match.date, "HH:MM")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      {isFetching && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  );
};

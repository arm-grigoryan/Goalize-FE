"use client";
import styles from "./HomeUpcomingMatchesCard.module.css";
import Title from "@/shared/Title";
import Image from "next/image";
import vsIcon from "../../assets/pngs/vsIcon.png";
import MatchListInnerCard from "@/entities/MatchListInnerCard";
import Link from "next/link";
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
import backgroundImageLeft from '../../assets/pngs/backgroundImageLeft.svg';
import backgroundImageRight from '../../assets/pngs/backgroundImageRight.svg';

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
    { skip: !hasMore },
  );

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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isFetching || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setOffset((prev) => prev + BATCH_SIZE);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore, allMatches]);

  useEffect(() => {
    if (!hasMore || isFetching || allMatches.length === 0) return;

    const container = scrollContainerRef.current;
    if (container && container.scrollHeight <= container.clientHeight) {
      setOffset((prev) => prev + BATCH_SIZE);
    }
  }, [allMatches, hasMore, isFetching]);
  const firstMatch = allMatches[0];
  const matches = allMatches.slice(1);

  let centralMatchLabel = null;

  if (firstMatch) {
    if (firstMatch.isLive) {
      centralMatchLabel = <LiveDateLabel isLive />;
    } else {
      const isValidDate =
        firstMatch.date && !isNaN(new Date(firstMatch.date).getTime());

      if (isValidDate) {
        centralMatchLabel = (
          <LiveDateLabel
            date={formatUTCDate(firstMatch.date)}
            time={formatUTCDate(firstMatch.date, "HH:MM")}
          />
        );
      } else {
        centralMatchLabel = <LiveDateLabel date="TBD" />;
      }
    }
  }

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
          <Link href={`/matches/${firstMatch.id}`} className={styles.match_inner_wrapper} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            <div className={styles.matchDateLabel}>
              {centralMatchLabel}
            </div>
            <div className={styles.leftRightWrapper}>
              <div className={styles.match_left_block}>
                <div className={styles.backgroundImageWrapper}>  
                <Image 
                  src={backgroundImageLeft}
                  alt=""
                  className={styles.backgroundImage}
                /> 
                </div>
                <div className={styles.match_left_block_inner_wrapper}>
                  <div>
                    <span className={styles.team_name}>
                      {firstMatch?.homeTeam?.name}
                    </span>
                  </div>
                  {firstMatch?.homeTeam?.logoUrl && (
                    <Image
                      src={firstMatch.homeTeam.logoUrl}
                      alt=""
                      className={styles.team_logo}
                      width={80}
                      height={80}
                    />
                  )}
                </div>
              </div>
              <div className={styles.vsIconWrapper}>
                <Image src={vsIcon} alt="Upcoming Match" />
              </div>
              <div className={styles.match_right_block}>
               <div className={styles.backgroundImageWrapper}>  
                <Image 
                  src={backgroundImageRight}
                  alt=""
                  className={styles.backgroundImage}
                /> 
                </div>
                <div className={styles.match_right_block_inner_wrapper}>
                  <div>
                    <span className={styles.team_name}>
                      {firstMatch?.awayTeam?.name}
                    </span>
                  </div>
                  {firstMatch?.awayTeam?.logoUrl && (
                    <Image
                      src={firstMatch.awayTeam.logoUrl}
                      alt=""
                      className={styles.team_logo}
                      width={80}
                      height={80}
                    />
                  )}
                </div>
              </div>
            </div>
          </Link>

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
                  <Link key={match.id} href={`/matches/${match.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" }}>
                    <MatchListInnerCard
                      teamNameHome={match.homeTeam.name}
                      homeTeamPoints={match.homeTeamPoints}
                      teamNameAway={match.awayTeam.name}
                      awayTeamPoints={match.awayTeamPoints}
                      matchDate={formatUTCDate(match.date)}
                      matchTime={formatUTCDate(match.date, "HH:MM")}
                    />
                  </Link>
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

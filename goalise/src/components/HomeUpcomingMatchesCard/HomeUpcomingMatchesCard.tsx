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
  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [firstMatch, setFirstMatch] = useState<UpcomingMatch | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const { data, isFetching } = useGetUpComingMatchesQuery(
    { take: 10, skip: offset },
    { skip: !hasMore }
  );

  useEffect(() => {
    if (!data) return;

    const firstFromBatch = data[0] ?? null;

    if (!firstMatch && firstFromBatch) {
      setFirstMatch(firstFromBatch);
    }

    const idToExclude = firstMatch?.id ?? firstFromBatch?.id ?? null;

    const filteredIncoming = idToExclude
      ? data.filter((m) => m.id !== idToExclude)
      : data;

    setMatches((prev) => {
      const merged = [...prev, ...filteredIncoming];

      const unique = merged.filter(
        (item, index, self) => index === self.findIndex((m) => m.id === item.id)
      );
      return unique;
    });

    if (data.length < 5) {
      setHasMore(false);
    }
  }, [data, firstMatch]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight) {
        setOffset((prev) => prev + 5);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);
console.log(data)
console.log(matches, '----------)')
  return (
    <>
      {!matches?.length ? (
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

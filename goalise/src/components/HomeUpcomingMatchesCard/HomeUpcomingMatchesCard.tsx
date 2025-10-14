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

export const HomeUpcomingMatchesCard = () => {
  const t = useTranslations();
  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [firstMatch, setFirstMatch] = useState<UpcomingMatch | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetUpComingMatchesQuery(
    { take: 5, skip: offset },
    { skip: !hasMore }
  );

  useEffect(() => {
    if (data) {
      setMatches((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.id === match.id)
        );
        if (!firstMatch && unique.length > 0) {
          setFirstMatch(unique.shift() || null);
        }
        return unique;
      });
      if (data.length < 5) {
        setHasMore(false);
      }
    }
  }, [data, offset, firstMatch]);

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

  return (
    <div className={styles.Home_main_card}>
      <div className={styles.match_inner_wrapper}>
        <div>
          <h3 className={styles.title}>{t("home.upcomingMatches.title")}</h3>
        </div>
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
            <Image src={teamLogoRight} alt="" className={styles.team_logo} />
          </div>
        </div>
      </div>
      <CustomDivider orientation="horizontal" />
      <div className={styles.next_match_list_wrapper}>
        <div className={styles.title_and_day_wrapper}>
          <Title content={t("home.upcomingMatches.matchList")} />
        </div>
        <div
          ref={scrollContainerRef}
          className={styles.next_matches_list_inner_wrapper}
        >
          {matches.map((match) => {
            const { date } = match;
            const d = new Date(date);
            return (
              <MatchListInnerCard
                key={match.id}
                teamNameHome={match.homeTeam.name}
                homeTeamPoints={match.homeTeamPoints}
                teamNameAway={match.awayTeam.name}
                awayTeamPoints={match.awayTeamPoints}
                matchDate={d.toLocaleDateString()}
                matchTime={d.toLocaleTimeString()}
              />
            );
          })}
          {isFetching && (
            <div className={styles.loader_container}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

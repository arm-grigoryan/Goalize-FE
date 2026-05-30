"use client";
import Title from "@/shared/Title";
import styles from "./LeaguesFixtures.module.css";
import PastMatchesInnerCard from "@/entities/PastMatchesInnerCard";
import winnerIcon from "../../assets/pngs/winnerIcon.svg";
import teamLogo from "../../assets/pngs/teamLogo.png";
import emptyImage from "../../assets/pngs/nextMatchEmpty.svg";
import Link from "next/link";
import { useGetLeaguesFixturesQuery } from "@/app/store/services/api";
import { ILeaguesResultsItem } from "@/types/api/leaguesResults";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { useTranslations } from "next-intl";
import Image from "next/image";

const PAGE_SIZE = 6;

export const LeaguesFixtures = () => {
  const { leagueId } = useParams();
  const leagueIdNum = Number(leagueId);
  const t = useTranslations("leagues.fixtures");

  const [offset, setOffset] = useState<number>(0);
  const [results, setResults] = useState<Record<string, ILeaguesResultsItem[]>>(
    {}
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: resultsData, isFetching } = useGetLeaguesFixturesQuery(
    { leagueId: leagueIdNum, skip: offset, take: PAGE_SIZE },
    { skip: !leagueId }
  );

  const pathname = usePathname();

  useEffect(() => {
    setOffset(0);
    setResults({});
    setHasMore(true);
  }, [pathname]);

  useEffect(() => {
    if (resultsData) {
      setResults((prev) => {
        const merged = { ...prev };

        Object.entries(resultsData).forEach(([stage, matches]) => {
          merged[stage] = merged[stage]
            ? [
                ...merged[stage],
                ...matches.filter(
                  (m: ILeaguesResultsItem) =>
                    !merged[stage].some((old) => old.id === m.id)
                ),
              ]
            : matches;
        });

        return merged;
      });

      const totalNew = Object.values(resultsData).reduce(
        (acc, arr) => acc + arr.length,
        0
      );

      if (totalNew < PAGE_SIZE) setHasMore(false);
    }
  }, [resultsData, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;

      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 1 && hasMore) {
        setOffset((prev) => prev + PAGE_SIZE);
      }
    };

    const container = scrollContainerRef.current;

    container?.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, hasMore]);

  const hasFixtures =
    Object.keys(results).length > 0 &&
    Object.values(results).some((matches) => matches.length > 0);

  return !isFetching && !hasFixtures ? (
    <div className={styles.emptyState}>
      <Image
        src={emptyImage}
        alt="No fixtures"
        width={64}
        height={64}
        className={styles.emptyImage}
      />

      <div className={styles.emptyTitle}>
        No upcoming fixtures available yet
      </div>
    </div>
  ) : (
    <div className={styles.leagues_fixtures}>
      <div className={styles.title_wrapper}>
        <Title content={t("title")} />
      </div>

      <div
        ref={scrollContainerRef}
        className={styles.fixtures_scroll_container}
      >
        {Object.entries(results).map(([stage, matches]) => (
          <div key={stage} className={styles.fixtures_list}>
            <Title content={stage} />

            {matches.map((match: ILeaguesResultsItem) => {
              const homeLogo = match.homeTeam.logoUrl?.startsWith("http")
                ? match.homeTeam.logoUrl
                : teamLogo;

              const awayLogo = match.awayTeam.logoUrl?.startsWith("http")
                ? match.awayTeam.logoUrl
                : teamLogo;

              return (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className={styles.match_link}
                >
                  <PastMatchesInnerCard
                    date={formatUTCDate(match.date)}
                    winnerIcon={winnerIcon}
                    teamLogo1={homeLogo}
                    teamLogo2={awayLogo}
                    teamName1={handleLongStrings(match.homeTeam.name, 8)}
                    teamName2={handleLongStrings(match.awayTeam.name, 8)}
                    teamScore1={match.homeTeamScore}
                    teamScore2={match.awayTeamScore}
                    variant={"fixtures"}
                  />
                </Link>
              );
            })}
          </div>
        ))}

        {isFetching && (
          <div className={styles.loader_container}>
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
};
"use client";
import Title from "@/shared/Title";
import styles from "./LeaguesResults.module.css";
import PastMatchesInnerCard from "@/entities/PastMatchesInnerCard";
import winnerIcon from "../../assets/pngs/winnerIcon.svg";
import teamLogo from "../../assets/pngs/teamLogo.png";
import drawIcon from "../../assets/pngs/drawIcon.png";
import { useGetLeaguesResultsQuery } from "@/app/store/services/api";
import { ILeaguesResultsItem } from "@/types/api/leaguesResults";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { formatUTCDate } from "@/helper/formatDateAndTime";

const PAGE_SIZE = 5;

export const LeaguesResults = () => {
  const { leagueId } = useParams();
  const leagueIdNum = Number(leagueId);
  const [offset, setOffset] = useState<number>(0);
  const [results, setResults] = useState<Record<string, ILeaguesResultsItem[]>>(
    {}
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: resultsData, isFetching } = useGetLeaguesResultsQuery(
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
      if (scrollTop + clientHeight >= scrollHeight && hasMore) {
        setOffset((prev) => prev + PAGE_SIZE);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, hasMore]);

  return (
    <div className={styles.leagues_results}>
      <div className={styles.title_wrapper}>
        <Title content="Results" />
      </div>
      <div
        ref={scrollContainerRef}
        className={styles.fixtures_scroll_container}
      >
        {Object.entries(results).map(([stage, matches]) => (
          <div key={stage} className={styles.fixtures_list}>
            <Title content={stage} />
            {matches.map((match: ILeaguesResultsItem) => {
              return (
                <PastMatchesInnerCard
                  key={match.id}
                  date={formatUTCDate(match.date)}
                  winnerIcon={winnerIcon}
                  drawIcon={drawIcon}
                  teamLogo1={teamLogo}
                  teamLogo2={teamLogo}
                  teamName1={handleLongStrings(match.homeTeam.name, 8)}
                  teamName2={handleLongStrings(match.awayTeam.name, 8)}
                  teamScore1={match.homeTeamScore}
                  teamScore2={match.awayTeamScore}
                  variant={"results"}
                />
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

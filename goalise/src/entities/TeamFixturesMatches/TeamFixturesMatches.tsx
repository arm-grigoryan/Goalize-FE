"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from './TeamFixturesMatches.module.css';
import teamLogoFallback from '../../assets/pngs/teamLogo.png';
import TeamsPastMatchesCard from "../TeamsPastMatchesCard";
import { useParams, usePathname } from "next/navigation";
import { useGetTeamMatchesQuery } from "@/app/store/services/api";
import { ITeamMatchResponse } from "@/types/api/teamMatches";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { handleLongStrings } from "@/helper/handleLongStrings";

const PAGE_SIZE = 10;

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const TeamFixturesMatches: React.FC = () => {
  const { teamId } = useParams();
  const teamIdNum = Number(teamId);
  const pathname = usePathname();

  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<ITeamMatchResponse[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetTeamMatchesQuery(
    { teamId: teamIdNum, isPast: false, skip: offset, take: PAGE_SIZE },
    { skip: !teamId }
  );

  useEffect(() => {
    setOffset(0);
    setMatches([]);
    setHasMore(true);
  }, [pathname]);

  useEffect(() => {
    if (data) {
      setMatches((prev) => {
        const existingIds = new Set(prev.map((m) => m.match.id));
        const newItems = data.filter((m) => !existingIds.has(m.match.id));
        return [...prev, ...newItems];
      });
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
  }, [data, offset]);

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
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Fixtures</div>
      </div>
      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div className={styles.matchesList}>
          {matches.map((item) => (
            <TeamsPastMatchesCard
              key={item.match.id}
              variant="fixtures"
              date={formatUTCDate(item.match.date)}
              teamLogo1={
                item.match.homeTeam.logoUrl && isValidUrl(item.match.homeTeam.logoUrl)
                  ? item.match.homeTeam.logoUrl
                  : teamLogoFallback
              }
              teamName1={handleLongStrings(item.match.homeTeam.name, 8)}
              teamName1Tooltip={item.match.homeTeam.name}
              teamScore1={item.match.homeTeamScore}
              teamLogo2={
                item.match.awayTeam.logoUrl && isValidUrl(item.match.awayTeam.logoUrl)
                  ? item.match.awayTeam.logoUrl
                  : teamLogoFallback
              }
              teamName2={handleLongStrings(item.match.awayTeam.name, 8)}
              teamName2Tooltip={item.match.awayTeam.name}
              teamScore2={item.match.awayTeamScore}
              leagueName={item.league.name}
              leagueId={item.league.id}
            />
          ))}
        </div>
        {isFetching && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader} />
          </div>
        )}
      </div>
    </div>
  );
};
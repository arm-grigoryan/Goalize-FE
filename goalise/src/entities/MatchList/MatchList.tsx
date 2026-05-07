import styles from "./MatchList.module.css";
import MatchCard from "../MatchCard";
import Image from "next/image";
import Link from "next/link";
import matchesIcon from "../../assets/pngs/calendar.svg";
import matchEmptyState from "../../assets/pngs/matchEmptyState.png";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useGetPlayerProfileMatchesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { IPlayerProfileMatches } from "@/types/api/PlayerProfilMatches";
import { formatUTCDate } from "@/helper/formatDateAndTime";

export const MatchList = () => {
  const t = useTranslations("playerProfile.pastMatches");
  const { playerId } = useParams();

  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<IPlayerProfileMatches[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetPlayerProfileMatchesQuery(
    { playerId: Number(playerId), skip: offset, take: 10 },
    { skip: !hasMore },
  );

  useEffect(() => {
    if (data) {
      setMatches((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.id === match.id),
        );
        return unique;
      });

      if (data.length < 10) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        setOffset((prev) => prev + 10);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
          <Image src={matchesIcon} alt="" className={styles.icon} />
        </div>
        <div className={styles.titleContainer}>
          <div className={styles.title}> {t("title")} </div>
          <div className={styles.label}> {t("label")}</div>
        </div>
      </div>
      <div ref={scrollContainerRef} className={styles.matches_list}>
        {!matches?.length && (
          <div className={styles.emptyState}>
            <Image src={matchEmptyState} alt="" width={297} height={222} className={styles.emptyImage} />
            <div className={styles.emptyText}>{t("emptyStateText")}</div>
          </div>
        )}

        {matches.map((match, i) => {
          const key = `${match.matchDate}-${match.homeTeam.id}-${match.awayTeam.id}-${i}`;
          return (
            <Link
              key={key}
              href={`/matches/${match.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                cursor: "pointer",
              }}
            >
              <MatchCard
                homeTeamName={match.homeTeam.name}
                homeTeamScore={match.homeTeamScore}
                awayTeamName={match.awayTeam.name}
                awayTeamScore={match.awayTeamScore}
                date={formatUTCDate(match.matchDate)}
                goalsCount={match.playerGoalsCount}
                peopleCount={match.playerAssistsCount}
                redCardsCount={match.playerRedsCount}
                yellowCardsCount={match.playerYellowsCount}
              />
            </Link>
          );
        })}
        {isFetching && (
          <div className={styles.loader_container}>
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
};

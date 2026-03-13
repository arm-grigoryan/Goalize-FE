"use client";
import styles from "./HomePastMatchesCard.module.css";
import calendarIcon from "../../assets/pngs/calendar.svg";
import Title from "@/shared/Title";
import PastMatchesInnerCard from "../../entities/PastMatchesInnerCard";
import winnerIcon from "../../assets/pngs/winnerIcon.svg";
import teamLogo from "../../assets/pngs/teamLogo.png";
import drawIcon from "../../assets/pngs/drawIcon.svg";
import { useGetPastMatchesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { IMatchesPast } from "@/types/api/matchesPast";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useTranslations } from "next-intl";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import Image from "next/image";
import pastMatchesEmpty from "../../assets/pngs/pastMatchesEmpty.svg";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const HomePastMatchesCard = () => {
  const BATCH_SIZE = 10;
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations();
  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<IMatchesPast[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useGetPastMatchesQuery(
    { take: BATCH_SIZE, skip: offset },
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
        return unique;
      });
      if (data.length < BATCH_SIZE) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 4) {
        setOffset((prev) => prev + BATCH_SIZE);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  return (
    <div className={`${styles.border} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.past_matches}>
        <div className={styles.button_and_title_wrapper}>
          <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
            <Image
              src={calendarIcon}
              alt=""
              className={styles.empty_calendar}
            />
          </div>
          <div className={styles.title_wrapper}>
            <Title content={t("home.pastMatches.title")} />
          </div>
        </div>

        {!matches?.length && (
          <div className={styles.no_match_wrapper}>
            <Image
              src={pastMatchesEmpty}
              alt=""
              className={styles.no_match_image}
            />
            <span className={styles.no_match_text}>
              No past match to show at the moment
            </span>
          </div>
        )}
        <div ref={scrollContainerRef} className={styles.match_wrapper}>
          {matches.map((match) => {
            return (
              <PastMatchesInnerCard
                key={match.id}
                date={formatUTCDate(match.date)}
                winnerIcon={winnerIcon}
                drawIcon={drawIcon}
                teamLogo1={teamLogo}
                teamName1={handleLongStrings(match.homeTeam.name, 9)}
                teamName1Tooltip={match.homeTeam.name}
                teamScore1={match.homeTeamScore}
                teamLogo2={teamLogo}
                teamName2={handleLongStrings(match.awayTeam.name, 9)}
                teamName2Tooltip={match.awayTeam.name}
                teamScore2={match.awayTeamScore}
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

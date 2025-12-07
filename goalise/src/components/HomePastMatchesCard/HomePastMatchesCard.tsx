"use client";
import styles from "./HomePastMatchesCard.module.css";
import Button from "@/shared/Button";
import calendarIcon from "../../assets/pngs/calendarIcon.png";
import Title from "@/shared/Title";
import PastMatchesInnerCard from "../../entities/PastMatchesInnerCard";
import winnerIcon from "../../assets/pngs/winnerIcon.png";
import teamLogo from "../../assets/pngs/teamLogo.png";
import drawIcon from "../../assets/pngs/drawIcon.png";
import { useGetPastMatchesQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { IMatchesPast } from "@/types/api/matchesPast";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useTranslations } from "next-intl";

export const HomePastMatchesCard = () => {
  const t = useTranslations();
  const [offset, setOffset] = useState<number>(0);
  const [matches, setMatches] = useState<IMatchesPast[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useGetPastMatchesQuery(
    { take: 10, skip: offset },
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
      if (data.length < 5) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

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
  const buttonClick = () => {
    // clicked
  };
  return (
    <div className={styles.past_matches}>
      <div className={styles.button_and_title_wrapper}>
        <div className={styles.button_wrapper}>
          <Button
            className="icon_button"
            handleClick={buttonClick}
            icon={calendarIcon}
          />
        </div>
        <div className={styles.title_wrapper}>
          <Title content={t("home.pastMatches.title")} />
        </div>
      </div>

      {!data?.length && (
        <div className={styles.no_match_wrapper}>
          <span className={styles.no_match_text}>
            No past match to show at the moment
          </span>
        </div>
      )}
      <div ref={scrollContainerRef} className={styles.match_wrapper}>
        {matches.map((match) => {
          const date = new Date(match.date).toLocaleDateString();
          return (
            <PastMatchesInnerCard
              key={match.id}
              date={date}
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
  );
};

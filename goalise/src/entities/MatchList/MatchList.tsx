import styles from "./MatchList.module.css";
import MatchCard from "../MatchCard";
import Image from "next/image";
import matchesIcon from "../../assets/pngs/calendar.svg";
import matchEmptyState from "../../assets/pngs/matchEmptyState.png";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useGetPlayerProfileMatchesQuery } from "@/app/store/services/api";

export const MatchList = () => {
  const t = useTranslations("playerProfile.pastMatches");
  const { playerId } = useParams();
  const { data: playerProfileMatches } = useGetPlayerProfileMatchesQuery({
    playerId: Number(playerId),
    skip: 0,
    take: 10,
  });
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
      <div className={styles.matches_list}>
        {!playerProfileMatches?.length && (
          <div className={styles.emptyState}>
            <Image src={matchEmptyState} alt="" />
            <div className={styles.emptyText}>{t("emptyStateText")}</div>
          </div>
        )}

        {playerProfileMatches?.map((match, i) => {
          return (
            <MatchCard
              key={i}
              homeTeamName={match.homeTeam.name}
              homeTeamScore={match.homeTeamScore}
              awayTeamName={match.awayTeam.name}
              awayTeamScore={match.awayTeamScore}
              date={new Date(match.matchDate).toLocaleDateString()}
              goalsCount={match.playerGoalsCount}
              peopleCount={match.playerAssistsCount}
              redCardsCount={match.playerRedsCount}
              yellowCardsCount={match.playerYellowsCount}
            />
          );
        })}
      </div>
    </div>
  );
};

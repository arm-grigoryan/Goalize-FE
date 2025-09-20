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

export const HomePastMatchesCard = () => {
  const { data } = useGetPastMatchesQuery();

  const buttonClick = () => {
    console.log("clicked");
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
          <Title content="Past Matches" />
        </div>
      </div>

      {/* <div className={styles.no_match_wrapper}>
        <span className={styles.no_match_text}>
          No past match is scheduled at the moment
        </span>
      </div> */}
      <div className={styles.match_wrapper}>
        {data?.map((match) => {
          const date = new Date(match.date).toLocaleDateString();
          return (
            <PastMatchesInnerCard
              key={match.id}
              date={date}
              winnerIcon={winnerIcon}
              drawIcon={drawIcon}
              teamLogo1={teamLogo}
              teamName1={match.homeTeam.name}
              teamScore1={match.homeTeamScore}
              teamLogo2={teamLogo}
              teamName2={match.awayTeam.name}
              teamScore2={match.awayTeamScore}
            />
          );
        })}
      </div>
    </div>
  );
};

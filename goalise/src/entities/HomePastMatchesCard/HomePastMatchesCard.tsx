"use client";
import styles from "./HomePastMatchesCard.module.css";
import Button from "@/shared/Button";
import calendarIcon from "../../assets/pngs/calendarIcon.png";
import Title from "@/shared/Title";
import PastMatchesInnerCard from "../PastMatchesInnerCard";
import winnerIcon from "../../assets/pngs/winnerIcon.png";
import teamLogo from "../../assets/pngs/teamLogo.png";
import drawIcon from "../../assets/pngs/drawIcon.png";

export const HomePastMatchesCard = () => {
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
          <span className={styles.title_description}>
            All the matches that was played in the past dates will display here.
          </span>
        </div>
      </div>

      {/* <div className={styles.no_match_wrapper}>
        <span className={styles.no_match_text}>
          No past match is scheduled at the moment
        </span>
      </div> */}
      <div className={styles.match_wrapper}>
        <PastMatchesInnerCard
          date="2023-10-01"
          winnerIcon={winnerIcon}
          drawIcon={drawIcon}
          teamLogo1={teamLogo}
          teamName1="Team A"
          teamScore1={2}
          teamLogo2={teamLogo}
          teamName2="Team B"
          teamScore2={3}
        />
        <PastMatchesInnerCard
          date="2023-10-01"
          winnerIcon={winnerIcon}
          drawIcon={drawIcon}
          teamLogo1={teamLogo}
          teamName1="Team A"
          teamScore1={2}
          teamLogo2={teamLogo}
          teamName2="Team B"
          teamScore2={1}
        />
        <PastMatchesInnerCard
          date="2023-10-01"
          winnerIcon={winnerIcon}
          drawIcon={drawIcon}
          teamLogo1={teamLogo}
          teamName1="Team A"
          teamScore1={0}
          teamLogo2={teamLogo}
          teamName2="Team B"
          teamScore2={0}
        />
      </div>
    </div>
  );
};

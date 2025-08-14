"use client";
import styles from "./HomeUpcaminMatchesCard.module.css";
import Title from "@/shared/Title";
import Button from "@/shared/Button";
import calendarIcon from "../../assets/pngs/calendarIcon.png";
import Image from "next/image";
import vsIcon from "../../assets/pngs/vsIcon.png";
import teamLogoLeft from "../../assets/pngs/teamLoroLeft.png";
import teamLogoRight from "../../assets/pngs/teamLogoRight.png";
import MatchListInnerCard from "@/entities/MatchListInnerCard";

export const HomeUpcaminMatchesCard = () => {
  const buttonClick = () => {
    console.log("clicked");
  };
  return (
    <div className={styles.Home_main_card}>
      <div className={styles.upcoming_mutch}>
        <div className={styles.inner_upcoming_mutch}>
          <div className={styles.unpcaming_match_title_wrapper}>
            <Button
              className="icon_button"
              handleClick={buttonClick}
              icon={calendarIcon}
            />
            <Title content="Upcaming Matches" />
            <span className={styles.text_span}>
              All the matches which will going to happen in future will display
              here.
            </span>
          </div>
        </div>
      </div>
      <div className={styles.match_wrapper}>
        {/* <span className={styles.no_match_text}>
          No match is scheduled at the moment
        </span> */}
        <div className={styles.match_inner_wrapper}>
          <div className={styles.match_left_block}>
            <div className={styles.match_left_block_inner_wrapper}>
              <div className={styles.position_block_left}>position 05</div>
              <div>
                <span className={styles.team_name}>Team Name</span>
              </div>
              <div>
                <span className={styles.achievements}>Achievements</span>
              </div>
              <Image src={teamLogoLeft} alt="" className={styles.team_logo} />
            </div>
          </div>
          <div>
            <Image src={vsIcon} alt="Upcoming Match" />
          </div>
          <div className={styles.match_right_block}>
            <div className={styles.match_right_block_inner_wrapper}>
              <div className={styles.position_block_right}>position 05</div>
              <div>
                <span className={styles.team_name}>Team Name</span>
              </div>
              <div>
                <span className={styles.achievements}>Achievements</span>
              </div>
              <Image src={teamLogoRight} alt="" className={styles.team_logo} />
            </div>
          </div>
        </div>
        <div className={styles.next_match_list_wrapper}>
          <div className={styles.title_and_day_wrapper}>
            <Title content="Match List" />
            <div className={styles.next_matches_list_day_wrapper}>
              {new Date().getDate()}
            </div>
          </div>
          <div className={styles.next_matches_list_inner_wrapper}>
            <MatchListInnerCard
              teamNameHome="Home Team"
              homeTeamPoints={2}
              teamNameAway="Away Team"
              awayTeamPoints={1}
              matchDate={new Date().toDateString()}
              matchTime={new Date().toLocaleTimeString()}
            />
            <MatchListInnerCard
              teamNameHome="Home Team"
              homeTeamPoints={2}
              teamNameAway="Away Team"
              awayTeamPoints={1}
              matchDate={new Date().toDateString()}
              matchTime={new Date().toLocaleTimeString()}
            />
            <MatchListInnerCard
              teamNameHome="Home Team"
              homeTeamPoints={2}
              teamNameAway="Away Team"
              awayTeamPoints={1}
              matchDate={new Date().toDateString()}
              matchTime={new Date().toLocaleTimeString()}
            />
            <MatchListInnerCard
              teamNameHome="Home Team"
              homeTeamPoints={2}
              teamNameAway="Away Team"
              awayTeamPoints={1}
              matchDate={new Date().toDateString()}
              matchTime={new Date().toLocaleTimeString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

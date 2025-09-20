"use client";
import styles from "./HomeUpcomingMatchesCard.module.css";
import Title from "@/shared/Title";
import Image from "next/image";
import vsIcon from "../../assets/pngs/vsIcon.png";
import teamLogoLeft from "../../assets/pngs/teamLoroLeft.png";
import teamLogoRight from "../../assets/pngs/teamLogoRight.png";
import MatchListInnerCard from "@/entities/MatchListInnerCard";
import { useGetUpComingMatchesQuery } from "@/app/store/services/api";
import CustomDivider from "@/shared/Divider";

export const HomeUpcomingMatchesCard = () => {
  const { data } = useGetUpComingMatchesQuery();

  console.log(data);

  return (
    <div className={styles.Home_main_card}>
      <div className={styles.match_inner_wrapper}>
        <div>
          <h3 className={styles.title}>Upcoming Matches</h3>
        </div>
        <div className={styles.match_left_block}>
          <div className={styles.match_left_block_inner_wrapper}>
            <div>
              <span className={styles.team_name}>
                {data?.[0]?.homeTeam?.name}
              </span>
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
            <div>
              <span className={styles.team_name}>
                {data?.[0]?.awayTeam?.name}
              </span>
            </div>
            <div>
              <span className={styles.achievements}>Achievements</span>
            </div>
            <Image src={teamLogoRight} alt="" className={styles.team_logo} />
          </div>
        </div>
      </div>
      <CustomDivider orientation="horizontal" />
      <div className={styles.next_match_list_wrapper}>
        <div className={styles.title_and_day_wrapper}>
          <Title content="Match List" />
          <div className={styles.next_matches_list_day_wrapper}>
            {new Date().getDate()}
          </div>
        </div>
        <div className={styles.next_matches_list_inner_wrapper}>
          {data?.map((match) => {
            const { date } = match;
            const d = new Date(date);
            return (
              <MatchListInnerCard
                key={match.id}
                teamNameHome={match.homeTeam.name}
                homeTeamPoints={match.homeTeamPoints}
                teamNameAway={match.awayTeam.name}
                awayTeamPoints={match.awayTeamPoints}
                matchDate={d.toLocaleDateString()}
                matchTime={d.toLocaleTimeString()}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

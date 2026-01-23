"use client";

import styles from "./LeguesJoinedTeams.module.css";
import {
  useGetLeaguesInfoQuery,
  useGetLeaguesJoinedTeamsQuery,
} from "@/app/store/services/api";
import LeaguesJoinedTeamCard from "@/entities/leaguesJoinedTeamCard";
import LeaguesJoinedTeamsProgressBar from "@/entities/LeguesJoinedTemasProgressBar";
import { useParams } from "next/navigation";

export const LeguesJoinedTeams = () => {
  const { leagueId } = useParams();
  const { data: leagueInfo } = useGetLeaguesInfoQuery(Number(leagueId));
  const { data } = useGetLeaguesJoinedTeamsQuery(Number(leagueId));
  // debug: joined teams data
  // debug: league info

  return (
    <div className={styles.leagues_joined_teams}>
      <div className={styles.titleWrapper}>
        Teams
        <div className={styles.titleCount}>{'(' + data?.length  + '/' + leagueInfo?.maxTeamsCount + ')'}</div>
      </div>
      <LeaguesJoinedTeamsProgressBar
        maxTeamsCount={leagueInfo?.maxTeamsCount || 0}
        registeredTeamsCount={data?.length || 0}
      />
      <div className={styles.joinedTeamsTitle}> 
        Joined Teams
      </div>
      <div className={styles.teams_container}>
        {data?.map((team) => (
          <LeaguesJoinedTeamCard
            key={team.id}
            teamName={team.name}
            captainName={team.captain.firstName + " " + team.captain.lastName}
          />
        ))}
      </div>
    </div>
  );
};

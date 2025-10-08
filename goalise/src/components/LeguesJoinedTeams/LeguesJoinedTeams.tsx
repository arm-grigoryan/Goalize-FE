"use client";

import styles from "./LeguesJoinedTeams.module.css";
import { useGetLeaguesJoinedTeamsQuery } from "@/app/store/services/api";
import LeaguesJoinedTeamCard from "@/entities/leaguesJoinedTeamCard";
import { useParams } from "next/navigation";

export const LeguesJoinedTeams = () => {
  const { leagueId } = useParams();
  const { data } = useGetLeaguesJoinedTeamsQuery(Number(leagueId));
  console.log(data, "joined teams data");

  return (
    <div className={styles.leagues_joined_teams}>
      <h2>Joined Teams</h2>
      <div className={styles.teams_container}>
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="John Doe"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Jane Smith"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />

        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
        <LeaguesJoinedTeamCard
          teamName="AFC Bournemouth"
          captainName="Mike Johnson"
        />
      </div>
    </div>
  );
};

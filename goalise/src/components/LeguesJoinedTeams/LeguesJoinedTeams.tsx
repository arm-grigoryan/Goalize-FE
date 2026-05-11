"use client";


import styles from "./LeguesJoinedTeams.module.css";
import { Loader } from "@/shared/Loader/Loader";
import {
  useGetLeaguesInfoQuery,
  useGetLeaguesJoinedTeamsQuery,
} from "@/app/store/services/api";
import LeaguesJoinedTeamCard from "@/entities/leaguesJoinedTeamCard";
import LeaguesJoinedTeamsProgressBar from "@/entities/LeguesJoinedTemasProgressBar";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const LeguesJoinedTeams = () => {
  const { leagueId } = useParams();
  const { data: leagueInfo } = useGetLeaguesInfoQuery(Number(leagueId));
  const { data } = useGetLeaguesJoinedTeamsQuery(Number(leagueId));
  const t = useTranslations("leagues.header");

  if (!leagueInfo || !data) {
    return (
      <div className={styles.leagues_joined_teams} style={{ minHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.leagues_joined_teams}>
      <div className={styles.titleWrapper}>
        {t("joinedTeams")}
        <div className={styles.titleCount}>{'(' + data?.length + '/' + leagueInfo?.maxTeamsCount + ')'}</div>
      </div>
      <LeaguesJoinedTeamsProgressBar
        maxTeamsCount={leagueInfo?.maxTeamsCount || 0}
        registeredTeamsCount={data?.length || 0}
      />
      <div className={styles.teams_container}>
        {data?.map((team) => (
          <LeaguesJoinedTeamCard
            key={team.id}
            teamId={team.id}
            teamName={team.name}
            teamLogoUrl={team.logoUrl}
            captainName={team.captain.firstName + " " + team.captain.lastName}
            captainPic={team.captain.profilePicStatus === "Approved" ? team.captain.profilePic : undefined}
          />
        ))}
      </div>
    </div>
  );
};

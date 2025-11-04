"use client";

import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import LeaguesGroupContainer from "@/components/LeaguesGroupContainer";
import LeguesJoinedTeams from "@/components/LeguesJoinedTeams";
import { useParams } from "next/navigation";

export default function LeaguesGroupPage() {
  const { leagueId } = useParams();
  const { data: leagueInfo } = useGetLeaguesInfoQuery(Number(leagueId));
  return (
    <div>
      {leagueInfo?.state === "Registration" ? (
        <LeguesJoinedTeams />
      ) : (
        <LeaguesGroupContainer />
      )}
      {/* <LeaguesGroupContainer />
      <LeguesJoinedTeams /> */}
    </div>
  );
}

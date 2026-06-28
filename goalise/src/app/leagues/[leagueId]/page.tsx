"use client";

import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import LeaguesGroupContainer from "@/components/LeaguesGroupContainer";
import LeguesJoinedTeams from "@/components/LeguesJoinedTeams";
import { useParams } from "next/navigation";
import { useHandle404 } from "@/hooks/useErrorHandling";
import { useEffect } from "react";
import { Loader } from "@/shared/Loader/Loader";
import { useTranslations } from "next-intl";

export default function LeaguesGroupPage() {
  const { leagueId } = useParams();
  const handle404 = useHandle404();
  const t = useTranslations("leagues");
  const {
    data: leagueInfo,
    error,
    isLoading,
    isError,
  } = useGetLeaguesInfoQuery(Number(leagueId));

  useEffect(() => {
    if (error) {
      handle404(error);
    }
  }, [error, handle404]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (isError && !leagueInfo) {
    return (
      <div
        style={{
          color: "#a5a5a5",
          fontSize: "14px",
          textAlign: "center",
          padding: "32px 0",
        }}
      >
        {t("failedToLoad")}
      </div>
    );
  }

  if (!leagueInfo) return null;

  return (
    <div>
      {leagueInfo?.state === "Registration" ? (
        <LeguesJoinedTeams />
      ) : (
        <LeaguesGroupContainer />
      )}
    </div>
  );
}

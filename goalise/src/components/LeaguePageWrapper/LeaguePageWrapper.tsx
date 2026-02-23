"use client";

import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { Loader } from "@/shared/Loader/Loader";
import React, { useEffect } from "react";
import { useHandle404 } from "@/hooks/useErrorHandling";

export const LeaguePageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { leagueId } = useParams();
  const handle404 = useHandle404();
  const id = Number(leagueId);

  const {
    data: leagueInfo,
    error,
    isLoading,
  } = useGetLeaguesInfoQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (error) {
      handle404(error);
    }
  }, [error, handle404]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (error || !leagueInfo) {
    return null;
  }

  return <div>{children}</div>;
};

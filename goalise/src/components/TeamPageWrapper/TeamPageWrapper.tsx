"use client";

import { useGetTeamInfoQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { Loader } from "@/shared/Loader/Loader";
import React, { useEffect } from "react";
import { useHandle404 } from "@/hooks/useErrorHandling";

export const TeamPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { teamId } = useParams();
  const handle404 = useHandle404();
  const id = Number(teamId);

  const {
    data: teamInfo,
    error,
    isLoading,
  } = useGetTeamInfoQuery(id, {
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

  if (error || !teamInfo) {
    return null;
  }

  return <div>{children}</div>;
};

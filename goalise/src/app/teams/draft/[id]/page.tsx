"use client";

import { use, useEffect } from "react";
import { useGetTeamDraftQuery, useGetUserInfoQuery } from "@/app/store/services/api";
import { useHandle404 } from "@/hooks/useErrorHandling";
import DraftTeam from "@/components/DraftTeam";

interface TeamDraftPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TeamDraftPage({ params }: TeamDraftPageProps) {
  const handle404 = useHandle404();
  const { id } = use(params);
  const teamId = Number(id);

  const { data, error, isLoading, isError } = useGetTeamDraftQuery(teamId, {
    skip: Number.isNaN(teamId),
  });

  const { data: userInfo } = useGetUserInfoQuery();
  const isCaptain = userInfo?.playerInfo?.id === data?.captainId;

  useEffect(() => {
    if (error) {
      handle404(error);
    }
  }, [error, handle404]);

  return (
    <div>
      <DraftTeam
        draftData={data}
        teamId={teamId}
        isLoading={isLoading}
        isError={isError}
        isCaptain={isCaptain}
      />
    </div>
  );
}

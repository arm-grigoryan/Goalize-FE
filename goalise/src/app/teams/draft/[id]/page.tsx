"use client";

import { use, useEffect } from "react";
import { useGetTeamDraftQuery } from "@/app/store/services/api";
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

  const { error } = useGetTeamDraftQuery(teamId, {
    skip: Number.isNaN(teamId),
  });

  useEffect(() => {
    if (error) {
      handle404(error);
    }
  }, [error, handle404]);

  return <div>
    <DraftTeam />
  </div>;
}

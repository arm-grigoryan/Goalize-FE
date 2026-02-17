"use client";

import { useEffect } from "react";
import { useGetTeamDraftQuery } from "@/app/store/services/api";
import { useHandle404 } from "@/hooks/useErrorHandling";

type TeamDraftPageProps = {
  params: {
    id: string;
  };
};

export default function TeamDraftPage({ params }: TeamDraftPageProps) {
  const handle404 = useHandle404();
  const teamId = Number(params.id);

  const { error } = useGetTeamDraftQuery(teamId, {
    skip: Number.isNaN(teamId),
  });

  useEffect(() => {
    if (error) {
      handle404(error);
    }
  }, [error, handle404]);

  return null;
}

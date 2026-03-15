'use client'
import React from "react";
import SquadCard from "../SquadCard";
import styles from './Squad.module.css';
import { useGetTeamSquadQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";

export const Squad: React.FC = () => {
  const params = useParams();
  const teamId = Number(params?.teamId);

  const { data: squad, isLoading } = useGetTeamSquadQuery(teamId, {
    skip: !teamId,
  });

  if (isLoading) return null;
  if (!squad?.length) return null;

  return (
    <div className={styles.container}>
      {squad.map((player) => (
        <SquadCard
          key={player.id}
          playerName={`${player.firstName} ${player.lastName}`}
          shirtNumber={player.shirtNumber}
          picture={player.picture}
          playerId={player.playerId}
        />
      ))}
    </div>
  );
};

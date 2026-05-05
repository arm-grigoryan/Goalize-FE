import React from "react";
import styles from './EventsPlayersCard.module.css';
import EventsPlayersInnerCard from "../EventsPlayersInnerCard";
import { IEventParticipant } from "@/types/api/events";

export interface IEventsPlayersCardProps {
    participants: IEventParticipant[];
    myPlayerId?: number;
}

export const EventsPlayersCard: React.FC<IEventsPlayersCardProps> = ({ participants, myPlayerId }) => {
    return <div className={styles.container}>
        {participants.map((p) => (
            <EventsPlayersInnerCard
                key={p.id}
                profilePic={p.userInfo.profilePic}
                playerName={`${p.userInfo.firstName} ${p.userInfo.lastName}`}
                phoneNumber={p.userInfo.phoneNumber}
                isYou={myPlayerId !== undefined && myPlayerId === p.playerId}
                playerId={p.playerId}
            />
        ))}
    </div>;
};

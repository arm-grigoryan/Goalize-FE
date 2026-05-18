import React from "react";
import styles from './EventsPlayersCard.module.css';
import EventsPlayersInnerCard from "../EventsPlayersInnerCard";
import { IEventParticipant } from "@/types/api/events";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export interface IEventsPlayersCardProps {
    participants: IEventParticipant[];
    myPlayerId?: number;
    hostId?: number;
}

export const EventsPlayersCard: React.FC<IEventsPlayersCardProps> = ({ participants, myPlayerId, hostId }) => {
    const {width} = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    return <div className={styles.container}>
        {participants.map((p) => {
            const isYou = myPlayerId !== undefined && myPlayerId === p.playerId;
            return (
                <EventsPlayersInnerCard
                    key={p.id}
                    profilePic={p.userInfo.profilePic}
                    playerName={
                        isMobile
                            ? p.userInfo.firstName
                            : `${p.userInfo.firstName} ${p.userInfo.lastName}`
                    }
                    phoneNumber={p.userInfo.phoneNumber}
                    isYou={isYou}
                    isHost={hostId !== undefined && hostId === p.playerId}
                    playerId={p.playerId}
                    hidePhone={isMobile && isYou}
                />
            );
        })}
    </div>;
};

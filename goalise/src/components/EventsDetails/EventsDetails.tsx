'use client'
import EventsHeader from "@/entities/EventsHeader";
import LeaguesJoinedTeamsProgressBar from "@/entities/LeguesJoinedTemasProgressBar";
import React from "react";
import styles from './EventsDetails.module.css';
import EventsPlayersCard from "@/entities/EventsPlayersCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import SquadCard from "@/entities/SquadCard";

export const EventsDetails: React.FC = () => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    
    return <>
        <EventsHeader type="detailed" />
        <div className={styles.progressBarInfoWrapper}> 
            <div className={styles.textsWrapper}> 
                <div className={styles.participantsCount}>
                    Participants 
                    <span>(10/30)</span>
                </div>
               {!isMobile &&
                <div className={styles.registrationDate}>
                    Registrations will be closed on 
                    <span>19/04/2025 14:55 </span>
                </div>}
            </div>
            <LeaguesJoinedTeamsProgressBar
                    maxTeamsCount={30}
                    registeredTeamsCount={10}
                />
        </div>
        <div className={`${styles.playersCards} ${isMobile && styles.mobilePlayersCards}`}>
           {isMobile ?  <EventsPlayersCard /> : <SquadCard variant="events" playerId={1} playerName="John Doe" shirtNumber={10} picture={null} menuType="captain"/>}
        </div>
    </>
}
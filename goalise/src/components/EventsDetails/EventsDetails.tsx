'use client'
import EventsHeader from "@/entities/EventsHeader";
import LeaguesJoinedTeamsProgressBar from "@/entities/LeguesJoinedTemasProgressBar";
import React from "react";
import styles from './EventsDetails.module.css';
import EventsPlayersCard from "@/entities/EventsPlayersCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import SquadCard from "@/entities/SquadCard";
import { useParams } from "next/navigation";
import { useGetEventByIdQuery, useGetUserInfoQuery } from "@/app/store/services/api";
import { useAuth } from "@/shared/auth/AuthContext";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { useTranslations } from "next-intl";

export const EventsDetails: React.FC = () => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const params = useParams();
    const eventId = Number(params.id);
    const { isAuthenticated } = useAuth();
    const t = useTranslations("events");

    const { data: event, isLoading } = useGetEventByIdQuery(eventId, { skip: !eventId });
    const { data: userInfo } = useGetUserInfoQuery(undefined, { skip: !isAuthenticated });
    const myPlayerId = userInfo?.playerInfo?.id;

    if (isLoading) return null;
    if (!event) return null;

    const participants = event.participants ?? [];
    const participantsCount = participants.length;
    const isFull = event.requiredPlayersAmount > 0 && participantsCount >= event.requiredPlayersAmount;
    const isRegClosed = event.registrationCloseDate
        ? new Date(event.registrationCloseDate) <= new Date()
        : false;
    const showRegistrationDate = event.state === 'Upcoming' && !isFull && !isRegClosed;

    const formattedRegClose = event.registrationCloseDate
        ? formatUTCDate(event.registrationCloseDate, 'dd/mm/yyyy HH:MM')
        : null;

    return <>
        <EventsHeader type="detailed" event={event} myPlayerId={myPlayerId} />
        <div className={styles.progressBarInfoWrapper}>
            <div className={styles.textsWrapper}>
                <div className={styles.participantsCount}>
                    {t("participants")}
                    <span>({participantsCount}/{event.requiredPlayersAmount})</span>
                </div>
                {!isMobile && showRegistrationDate && formattedRegClose && (
                    <div className={styles.registrationDate}>
                        {t("registrationsWillBeClosedOn")}
                        <span>{formattedRegClose}</span>
                    </div>
                )}
            </div>
            <LeaguesJoinedTeamsProgressBar
                maxTeamsCount={event.requiredPlayersAmount}
                registeredTeamsCount={participantsCount}
            />
        </div>
        <div className={`${styles.playersCards} ${isMobile && styles.mobilePlayersCards}`}>
            {isMobile
                ? <EventsPlayersCard participants={participants} myPlayerId={myPlayerId} hostId={event.hostId} />
                : participants.map((p) => (
                    <SquadCard
                        key={p.id}
                        variant="events"
                        playerId={p.playerId}
                        playerName={`${p.userInfo.firstName} ${p.userInfo.lastName}`}
                        shirtNumber={0}
                        picture={p.userInfo.profilePic}
                        menuType="none"
                        isOwnCard={myPlayerId !== undefined && myPlayerId === p.playerId}
                        isHost={p.playerId === event.hostId}
                        phoneNumber={p.userInfo.phoneNumber}
                    />
                ))
            }
        </div>
    </>;
};

import React from "react";
import styles from './EventsPlayersCard.module.css';
import EventsPlayersInnerCard from "../EventsPlayersInnerCard";
import teamLogo from '../../assets/pngs/teamLogo.png';

export const EventsPlayersCard: React.FC = () => {
    return <div className={styles.container}>
            <EventsPlayersInnerCard  count={1} playerLogo={teamLogo} playerName="Player Name 1" phoneNumber="0986725168"/>
            <EventsPlayersInnerCard count={2} playerLogo={teamLogo} playerName="Player Name 2" phoneNumber="0986247682168"/>
            <EventsPlayersInnerCard count={3} playerLogo={teamLogo} playerName="Player Name 3" phoneNumber="0986725168"/>
            <EventsPlayersInnerCard count={4} playerLogo={teamLogo} playerName="Player Name 4" phoneNumber="0986768" isHost/>
            <EventsPlayersInnerCard count={5} playerLogo={teamLogo} playerName="Player Name 5" phoneNumber="09168"/>
            <EventsPlayersInnerCard count={6} playerLogo={teamLogo} playerName="Player Name 6" phoneNumber="0986725168"/>
            <EventsPlayersInnerCard count={7} playerLogo={teamLogo} playerName="Player Name 7" phoneNumber="68"/>
    </div>
}
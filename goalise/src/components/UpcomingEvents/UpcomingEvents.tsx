import EventCard from "@/entities/EventCard";
import React from "react";
import styles from './UpcomingEvents.module.css';

export const UpcomingEvents: React.FC = () => {
    return <>
            <div className={styles.eventCardWrapper}>
                <EventCard />
                <EventCard canceled/>
                <EventCard />
                <EventCard />
                <EventCard  canceled/>
                <EventCard />
            </div>
    </>
}
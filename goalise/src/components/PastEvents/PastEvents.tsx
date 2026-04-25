import EventCard from "@/entities/EventCard"
import React from "react"
import styles from './PastEvents.module.css';
export const PastEvents: React.FC = () => {
    return <>
        <div className={styles.eventCardWrapper}>
            <EventCard variant="past" />
            <EventCard variant="past" />
            <EventCard variant="past" canceled />
            <EventCard variant="past" />
            <EventCard variant="past" />
            <EventCard variant="past" canceled/>
        </div>
     </>
}
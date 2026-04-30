'use client'
import EventCard from "@/entities/EventCard";
import React, { useEffect, useState } from "react";
import styles from './PastEvents.module.css';
import { useGetEventsQuery } from "@/app/store/services/api";
import { IEvent } from "@/types/api/events";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const TAKE = 20;

export const PastEvents: React.FC = () => {
    const [skip, setSkip] = useState(0);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const refreshKey = useSelector((state: RootState) => state.events.refreshKey);

    const { data, isFetching, isError } = useGetEventsQuery(
        { skip, take: TAKE, isUpcoming: false },
    );

    useEffect(() => {
        setEvents([]);
        setSkip(0);
        setHasMore(true);
    }, [refreshKey]);

    useEffect(() => {
        if (data) {
            setEvents((prev) => {
                const merged = [...prev, ...data.items];
                return merged.filter(
                    (item, index, self) => index === self.findIndex((e) => e.id === item.id),
                );
            });
            if (data.items.length < TAKE) {
                setHasMore(false);
            }
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            if (isFetching || !hasMore) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollTop + windowHeight >= docHeight - 200) {
                setSkip((prev) => prev + TAKE);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, hasMore]);

    return <>
        <div className={styles.eventCardWrapper}>
            {events.map((event) => (
                <EventCard key={event.id} variant="past" event={event} />
            ))}
        </div>
        {isFetching && (
            <div className={styles.loaderContainer}>
                <div className={styles.loader} />
            </div>
        )}
        {isError && (
            <div className={styles.errorText}>Failed to load events.</div>
        )}
        {!isFetching && !isError && events.length === 0 && (
            <div className={styles.emptyText}>No past events.</div>
        )}
    </>
}

import UpcomingEvents from "@/components/UpcomingEvents";
import EventsHeader from "@/entities/EventsHeader";
import styles from './page.module.css';
import Link from "next/link";
import PastEvents from "@/components/PastEvents";
type Tab = "upcoming" | "past";

interface EventsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { tab } = await searchParams;
  const activeTab: Tab = tab === "past" ? "past" : "upcoming";

  return <div>
            <EventsHeader type="default"/>
            <div className={styles.tabs}>
                <Link className={`${styles.tab} ${activeTab === "upcoming" ? styles.isActive : ''}`} href="?tab=upcoming">Upcoming Events</Link>
                <Link className={`${styles.tab} ${activeTab === "past" ? styles.isActive : ''}`} href="?tab=past">Past Events</Link>
            </div>
            {activeTab === "upcoming" ? <UpcomingEvents /> : <PastEvents />}
    </div>;
}

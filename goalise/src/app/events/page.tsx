import UpcomingEvents from "@/components/UpcomingEvents";
import EventsHeader from "@/entities/EventsHeader";
import styles from './page.module.css';
import Link from "next/link";
import PastEvents from "@/components/PastEvents";
type Tab = "upcoming" | "past";

interface EventsPageProps {
  searchParams: { tab?: string };
}

export default function EventsPage({ searchParams }: EventsPageProps) {
  const tab: Tab =
    searchParams.tab === "past" ? "past" : "upcoming";

  return <div>
            <EventsHeader type="default"/>
            <div className={styles.tabs}>
                <Link className={`${styles.tab} ${tab === "upcoming" && styles.isActive}`} href="?tab=upcoming">Upcoming Events</Link>
                <Link className={`${styles.tab} ${tab === "past" && styles.isActive}`} href="?tab=past">Past Events</Link>
            </div>
            {tab === "upcoming" ? <UpcomingEvents /> : <PastEvents /> };
    </div>
}

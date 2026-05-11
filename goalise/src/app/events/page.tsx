import UpcomingEvents from "@/components/UpcomingEvents";
import EventsHeader from "@/entities/EventsHeader";
import styles from './page.module.css';
import Link from "next/link";
import PastEvents from "@/components/PastEvents";
import { getTranslations } from "next-intl/server";
type Tab = "upcoming" | "past";

interface EventsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { tab } = await searchParams;
  const activeTab: Tab = tab === "past" ? "past" : "upcoming";
  const t = await getTranslations("events.tabs");

  return <div>
            <EventsHeader type="default"/>
            <div className={styles.tabs}>
                <Link className={`${styles.tab} ${activeTab === "upcoming" ? styles.isActive : ''}`} href="?tab=upcoming">{t("upcoming")}</Link>
                <Link className={`${styles.tab} ${activeTab === "past" ? styles.isActive : ''}`} href="?tab=past">{t("past")}</Link>
            </div>
            {activeTab === "upcoming" ? <UpcomingEvents /> : <PastEvents />}
    </div>;
}

type Tab = "upcoming" | "past";

interface EventsPageProps {
  searchParams: { tab?: string };
}

export default function EventsPage({ searchParams }: EventsPageProps) {
  const tab: Tab =
    searchParams.tab === "past" ? "past" : "upcoming";

  return <div>{tab === "upcoming" ? "Upcoming Events" : "Past Events"}</div>;
}

import LeaguesHeader from "@/components/LeaguesHeader";
import { LeaguePageWrapper } from "@/components/LeaguePageWrapper/LeaguePageWrapper";

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LeaguePageWrapper>
      <div>
        <LeaguesHeader />
      </div>

      <div>{children}</div>
    </LeaguePageWrapper>
  );
}

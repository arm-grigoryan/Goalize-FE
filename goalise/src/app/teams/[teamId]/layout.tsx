import { TeamOverviewHeader } from "@/entities/TeamOverviewHeader/TeamOverviewHeader";
import { TeamPageWrapper } from "@/components/TeamPageWrapper/TeamPageWrapper";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeamPageWrapper>
      <div>
        <TeamOverviewHeader />
      </div>
      <div>{children}</div>
    </TeamPageWrapper>
  );
}

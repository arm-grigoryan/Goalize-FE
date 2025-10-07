import LeaguesHeader from "@/components/LeaguesHeader";

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <LeaguesHeader />
      </div>

      <div>{children}</div>
    </div>
  );
}

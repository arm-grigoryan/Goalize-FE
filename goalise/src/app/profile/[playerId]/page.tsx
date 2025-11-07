export default function PlayerProfilePage({
  params,
}: {
  params: { playerId: string };
}) {
  return (
    <div>this is player profile page for player ID {params.playerId} </div>
  );
}

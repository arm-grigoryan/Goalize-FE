export interface IMatchPlayerStat {
  id: number;
  teamPlayerId: number;
  matchId: number;
  rate: number;
  goals: number;
  assists: number;
  passes: number;
  shots: number;
  passesCompleted: number;
  shotsCompleted: number;
  tackles: number;
  interceptions: number;
  goalConceded: number;
  saves: number;
  savedPenalties: number;
  goalKeeperRate: number;
  yellowCards: number;
  redCards: number;
}

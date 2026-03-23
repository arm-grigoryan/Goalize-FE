export interface IMatchStats {
  id: number;
  leagueMatchId: number;
  homeTeamShots: number;
  awayTeamShots: number;
  homeTeamShotsComplete: number;
  awayTeamShotsComplete: number;
  homeTeamPass: number;
  awayTeamPass: number;
  homeTeamPassComplete: number;
  awayTeamPassComplete: number;
  homeTeamFouls: number;
  awayTeamFouls: number;
  homeTeamCorners: number;
  awayTeamCorners: number;
}

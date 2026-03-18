export type SearchItemType = "league" | "team" | "profile";

export interface PlayerInviteResult {
  playerId: number;
  fullName: string;
  teamName: string;
  pictureUrl: string;
  matchScore: number;
  showDisabled: boolean;
  requiredCompletionPercentage: number;
  completionPercentage: number;
}

export interface SearchItem {
  id: number;
  mainText: string;
  secondaryText: string;
  pictureUrl: string;
  matchScore: number;
  type: SearchItemType;
}

export interface SearchResponse {
  leagues: SearchItem[];
  teams: SearchItem[];
  players: SearchItem[];
}

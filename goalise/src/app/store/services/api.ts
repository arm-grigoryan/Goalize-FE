import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UpcomingMatch } from "../../../types/api/upComingMatches";
import { IMatchesPast } from "@/types/api/matchesPast";
import { ITransfers } from "@/types/api/transfers";
import { ILeague } from "@/types/api/leagues";
import { ILeaguesGroup } from "@/types/api/leaguesGroup";
import { ILeaguesResults } from "@/types/api/leaguesResults";
import { ITeam } from "@/types/api/temas";
import { IPlayerProfile } from "@/types/api/userInfo";
import { IPlayerStats } from "@/types/api/playerStats";
import { IPlayerTransferHistory } from "@/types/api/playerTransferHistory";
import { IPlayerProfileMatches } from "@/types/api/PlayerProfilMatches";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = JSON.parse(
          localStorage.getItem("goalize_auth_tokens") || "null"
        );
        console.log(token.accessToken, "token from local storage");

        if (token) {
          headers.set("Authorization", `Bearer ${token.accessToken}`);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUpComingMatches: builder.query<
      UpcomingMatch[],
      { take: number; skip: number }
    >({
      query: ({ take, skip }) => ({
        url: "/matches/upcoming",
        params: { take, skip },
      }),
    }),
    getPastMatches: builder.query<
      IMatchesPast[],
      { take: number; skip: number }
    >({
      query: ({ take, skip }) => ({
        url: "/matches/past",
        params: { take, skip },
      }),
    }),
    getTransferNews: builder.query<
      ITransfers[],
      { take: number; skip: number }
    >({
      query: ({ take, skip }) => ({
        url: "/transfers",
        params: { take, skip },
      }),
    }),
    getLeagues: builder.query<ILeague[], void>({
      query: () => `/leagues`,
    }),
    getLeaguesInfo: builder.query<ILeague, number>({
      query: (leagueId) => `/leagues/${leagueId}/info`,
    }),
    getLeagueGroups: builder.query<ILeaguesGroup, number>({
      query: (leagueId) => `/leagues/${leagueId}/groups`,
    }),
    getLeaguesResults: builder.query<
      ILeaguesResults,
      { leagueId: number; skip: number; take: number }
    >({
      query: ({ leagueId, skip, take }) => ({
        url: `/leagues/${leagueId}/results`,
        params: { skip, take },
      }),
    }),
    getLeaguesFixtures: builder.query<
      ILeaguesResults,
      { leagueId: number; skip: number; take: number }
    >({
      query: ({ leagueId, skip, take }) => ({
        url: `/leagues/${leagueId}/fixtures`,
        params: { skip, take },
      }),
    }),
    getLeaguesJoinedTeams: builder.query<ITeam[], number>({
      query: (leagueId) => `/leagues/${leagueId}/joined-teams`,
    }),
    getUserInfo: builder.query<IPlayerProfile, void>({
      query: () => `/players/me`,
    }),
    getPlayerBasicInfo: builder.query<IPlayerProfile, number>({
      query: (playerId) => `/players/${playerId}/info`,
    }),
    getPlayerStats: builder.query<IPlayerStats, number>({
      query: (playerId) => `/players/${playerId}/stats`,
    }),
    getPlayerTransferHistory: builder.query<IPlayerTransferHistory[], number>({
      query: (playerId) => `/players/${playerId}/transfers`,
    }),
    getPlayerProfileMatches: builder.query<
      IPlayerProfileMatches[],
      { playerId: number; skip: number; take: number }
    >({
      query: ({ playerId, skip, take }) => ({
        url: `/players/${playerId}/matches`,
        params: { skip, take },
      }),
    }),
  }),
});

export const {
  useGetUpComingMatchesQuery,
  useGetPastMatchesQuery,
  useGetTransferNewsQuery,
  useGetLeaguesQuery,
  useGetLeagueGroupsQuery,
  useGetLeaguesResultsQuery,
  useGetLeaguesFixturesQuery,
  useGetLeaguesJoinedTeamsQuery,
  useGetLeaguesInfoQuery,
  useGetUserInfoQuery,
  useGetPlayerBasicInfoQuery,
  useGetPlayerStatsQuery,
  useGetPlayerTransferHistoryQuery,
  useGetPlayerProfileMatchesQuery,
} = api;

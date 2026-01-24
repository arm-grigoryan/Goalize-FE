import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UpcomingMatch } from "../../../types/api/upComingMatches";
import { IMatchesPast } from "@/types/api/matchesPast";
import { ITransfers } from "@/types/api/transfers";
import { ILeague } from "@/types/api/leagues";
import { ILeaguesGroup } from "@/types/api/leaguesGroup";
import { ILeaguesResults } from "@/types/api/leaguesResults";
import { ITeam } from "@/types/api/temas";
import { IPlayerProfile } from "@/types/api/userInfo";
import type { SearchResponse } from "@/types/api/search";
import { IPlayerStats } from "@/types/api/playerStats";
import { IPlayerTransferHistory } from "@/types/api/playerTransferHistory";
import { IPlayerProfileMatches } from "@/types/api/PlayerProfilMatches";
import { IDrowStandings } from "@/types/api/drowStandings";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
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
    getLeaguesDraw: builder.query<IDrowStandings, number>({
      query: (leagueId) => `/leagues/${leagueId}/draw`,
    }),
    getPlayerStats: builder.query<IPlayerStats, number>({
      query: (playerId) => `/players/${playerId}/stats`,
    }),
    getPlayerTransferHistory: builder.query<
      IPlayerTransferHistory[],
      { playerId: number; skip: number; take: number }
    >({
      query: ({ playerId, skip, take }) => ({
        url: `/players/${playerId}/transfers`,
        params: { skip, take },
      }),
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
    getSearchAutoComplete: builder.query<SearchResponse, string>({
      query: (text) => ({
        url: `/search/auto-complete`,
        params: { searchText: text },
      }),
    }),
  }),
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = JSON.parse(
          localStorage.getItem("goalize_auth_tokens") || "null"
        );

        if (token) {
          headers.set("Authorization", `Bearer ${token.accessToken}`);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserInfo: builder.query<IPlayerProfile, void>({
      query: () => `/players/me`,
    }),
    sendTeamInvitation: builder.mutation<
      void,
      { teamId: number; playerId: number }
    >({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/invitations`,
        method: "POST",
        body: { playerId },
      }),
    }),
    removeTeamMember: builder.mutation<
      void,
      { teamId: number; playerId: number }
    >({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/members/${playerId}`,
        method: "DELETE",
      }),
    }),
    quitTeam: builder.mutation<void, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/teams/${teamId}/members/me`,
        method: "DELETE",
      }),
    }),
    makeTeamCaptain: builder.mutation<
      void,
      { teamId: number; playerId: number }
    >({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/captain/${playerId}`,
        method: "PUT",
      }),
    }),
    getPlayerBasicInfo: builder.query<IPlayerProfile, number>({
      query: (playerId) => `/players/${playerId}/info`,
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
  useGetLeaguesDrawQuery,
  useGetPlayerStatsQuery,
  useGetPlayerTransferHistoryQuery,
  useGetPlayerProfileMatchesQuery,
  useGetSearchAutoCompleteQuery,
  useLazyGetSearchAutoCompleteQuery,
} = publicApi;

export const {
  useGetUserInfoQuery,
  useGetPlayerBasicInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useQuitTeamMutation,
  useMakeTeamCaptainMutation,
} = api;

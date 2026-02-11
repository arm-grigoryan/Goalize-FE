import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";
import type { QueryReturnValue } from "@reduxjs/toolkit/query";
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
import { ITopPlayers } from "@/types/api/topPlayers";
import { startLoginRedirect } from "@/shared/auth/oidcService";
import { setError } from "../slices/errorSlice";

// Prevent multiple simultaneous 401 redirects
let is401HandlingInProgress = false;

// Helper function to handle 401 errors globally (once per session)
const handle401Error = () => {
  if (typeof window === "undefined") return;

  if (is401HandlingInProgress) return;
  is401HandlingInProgress = true;

  // Clear auth tokens from localStorage
  localStorage.removeItem("goalize_auth_tokens");

  // Trigger storage event to notify AuthContext
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "goalize_auth_tokens",
      newValue: null,
    }),
  );

  // Redirect to login page
  startLoginRedirect();
};

// Custom error handler for base queries
const createErrorHandlingBaseQuery = (
  baseQuery: ReturnType<typeof fetchBaseQuery>,
  isAuthenticatedApi: boolean = false,
) => {
  return async (
    args: Parameters<typeof baseQuery>[0],
    api: Parameters<typeof baseQuery>[1],
    extraOptions: Parameters<typeof baseQuery>[2],
  ) => {
    const response = await baseQuery(args, api, extraOptions);

    // Handle API errors
    if (response.error) {
      const status = (response.error as FetchBaseQueryError).status;

      if (isAuthenticatedApi && status === 401) {
        // 401 Unauthorized - Clear auth and redirect
        handle401Error();
      }

      if (status === 403 || (typeof status === "number" && status >= 500)) {
        if (status === 403) {
          window.dispatchEvent(new CustomEvent("app:403"));
        }
        // For 5xx errors, dispatch to Redux to show banner
        if (typeof status === "number" && status >= 500) {
          api.dispatch(
            setError({
              errorType: "5xx",
              message: "Something went wrong, try again later.",
            }),
          );
        }
      }
    }

    return response;
  };
};

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
    getLeaguesTopPlayers: builder.query<ITopPlayers[], number>({
      query: (leagueId) => `/leagues/${leagueId}/top-players`,
    }),
  }),
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: createErrorHandlingBaseQuery(
    fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      prepareHeaders: (headers) => {
        if (typeof window !== "undefined") {
          const token = JSON.parse(
            localStorage.getItem("goalize_auth_tokens") || "null",
          );

          if (token) {
            headers.set("Authorization", `Bearer ${token.accessToken}`);
          }
        }

        return headers;
      },
    }),
    true, // isAuthenticatedApi = true
  ),
  endpoints: (builder) => ({
    getUserInfo: builder.query<IPlayerProfile, void>({
      // Use queryFn instead of query to have conditional logic
      // This prevents unnecessary API calls when user is not authenticated
      queryFn: async (_, __, ___, baseQuery) => {
        if (typeof window === "undefined") {
          return { error: { status: 401, data: "Not in browser" } };
        }

        const tokens = JSON.parse(
          localStorage.getItem("goalize_auth_tokens") || "null",
        );

        // Skip the query if no token exists - prevents 401 errors on initial load
        if (!tokens) {
          return { error: { status: 401, data: "No token found" } };
        }

        // Make the actual API call if token exists
        return baseQuery({
          url: "/players/me",
          method: "GET",
        }) as Promise<QueryReturnValue<IPlayerProfile, FetchBaseQueryError, FetchBaseQueryMeta>>;
      },
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
    joinLeague: builder.mutation<void, { leagueId: number; teamId: number }>({
      query: ({ leagueId, teamId }) => ({
        url: `/Leagues/${leagueId}/teams/${teamId}`,
        method: "PUT",
      }),
    }),
    unjoinLeague: builder.mutation<void, { leagueId: number; teamId: number }>({
      query: ({ leagueId, teamId }) => ({
        url: `/Leagues/${leagueId}/teams/${teamId}`,
        method: "DELETE",
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
  useGetLeaguesDrawQuery,
  useGetPlayerStatsQuery,
  useGetPlayerTransferHistoryQuery,
  useGetPlayerProfileMatchesQuery,
  useGetSearchAutoCompleteQuery,
  useLazyGetSearchAutoCompleteQuery,
  useGetLeaguesTopPlayersQuery,
} = publicApi;

export const {
  useGetUserInfoQuery,
  useGetPlayerBasicInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useQuitTeamMutation,
  useMakeTeamCaptainMutation,
  useJoinLeagueMutation,
  useUnjoinLeagueMutation,
} = api;

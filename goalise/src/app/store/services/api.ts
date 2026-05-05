import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";
import type { QueryReturnValue } from "@reduxjs/toolkit/query";
import type { UpcomingMatch } from "../../../types/api/upComingMatches";
import { IMatchesPast } from "@/types/api/matchesPast";
import { IMatches } from "@/types/api/matches";
import { IMatchStats } from "@/types/api/matchStats";
import { ITransfers, ITeamTransfer } from "@/types/api/transfers";
import { ILeague } from "@/types/api/leagues";
import { ILeaguesGroup } from "@/types/api/leaguesGroup";
import { ILeaguesResults } from "@/types/api/leaguesResults";
import { ITeam, ITeamDraft, ITeamJoined, ITeamListItem, ITeamNextMatch, ITeamTrophy } from "@/types/api/temas";
import { IPlayerProfile } from "@/types/api/userInfo";
import type { SearchResponse, PlayerInviteResult } from "@/types/api/search";
import { IPlayerStats } from "@/types/api/playerStats";
import { IMatchLineUps } from "@/types/api/matchLineUps";
import { IMatchPlayerStat } from "@/types/api/matchPlayerStats";
import { IPlayerTransferHistory } from "@/types/api/playerTransferHistory";
import { IPlayerProfileMatches } from "@/types/api/PlayerProfilMatches";
import { IDrowStandings } from "@/types/api/drowStandings";
import { ITopPlayers, ITeamTopPlayers } from "@/types/api/topPlayers";
import { ITeamMatchResponse } from "@/types/api/teamMatches";
import { ISquadPlayer } from "@/types/api/squad";
import {
  startLoginRedirect,
  getStoredTokens,
  refreshTokens,
} from "@/shared/auth/oidcService";
import { setError } from "../slices/errorSlice";
import { NotificationItemDto } from "@/types/api/notifications";
import { ICreateEventRequest, IEvent, IEventsResponse, IEventDetail } from "@/types/api/events";

const getApiLocale = (): string => {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/\.AspNetCore\.Culture=c=([^|;]+)/);
  return match ? match[1] : "en";
};

let refreshPromise: Promise<string | null> | null = null;

const acquireFreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const stored = getStoredTokens();
      if (!stored?.refreshToken) return null;

      const newTokens = await refreshTokens(stored.refreshToken);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "goalize_auth_tokens",
          newValue: JSON.stringify(newTokens),
        }),
      );

      return newTokens.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const forceLogout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("goalize_auth_tokens");

  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "goalize_auth_tokens",
      newValue: null,
    }),
  );

  startLoginRedirect();
};

const createErrorHandlingBaseQuery = (
  baseQuery: ReturnType<typeof fetchBaseQuery>,
  isAuthenticatedApi: boolean = false,
) => {
  return async (
    args: Parameters<typeof baseQuery>[0],
    api: Parameters<typeof baseQuery>[1],
    extraOptions: Parameters<typeof baseQuery>[2],
  ) => {
    let response = await baseQuery(args, api, extraOptions);

    if (response.error) {
      const status = (response.error as FetchBaseQueryError).status;

      if (isAuthenticatedApi && status === 401) {
        const newAccessToken = await acquireFreshAccessToken();

        if (newAccessToken) {
          response = await baseQuery(args, api, extraOptions);
        } else {
          forceLogout();
          return response;
        }
      }

      if (response.error) {
        const retryStatus = (response.error as FetchBaseQueryError).status;

        if (retryStatus === 403 || (typeof retryStatus === "number" && retryStatus >= 500)) {
          if (retryStatus === 403) {
            window.dispatchEvent(new CustomEvent("app:403"));
          }
          if (typeof retryStatus === "number" && retryStatus >= 500) {
            api.dispatch(
              setError({
                errorType: "5xx",
                message: "Something went wrong,Please try again later.",
              }),
            );
          }
        }
      }
    }

    return response;
  };
};

export const publicApi = createApi({
  reducerPath: "publicApi",
  tagTypes: ["Events"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept-Language", getApiLocale());
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
    getLeaguesJoinedTeams: builder.query<ITeamJoined[], number>({
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
    getEvents: builder.query<IEventsResponse, { skip: number; take: number; isUpcoming: boolean }>({
      query: ({ skip, take, isUpcoming }) => ({
        url: "/Events",
        params: { skip, take, isUpcoming },
      }),
      providesTags: ["Events"],
    }),
    getMatchById: builder.query<IMatches, number>({
      query: (matchId) => `/Matches/${matchId}`,
    }),
    getMatchLineup: builder.query<IMatchLineUps, number>({
      query: (matchId) => `/Matches/${matchId}/lineup`,
    }),
    getMatchPlayerStats: builder.query<IMatchPlayerStat[], number>({
      query: (matchId) => `/Matches/${matchId}/player-stats`,
    }),
    getMatchStats: builder.query<IMatchStats | null, number>({
      query: (matchId) => ({
        url: `/Matches/${matchId}/stats`,
        responseHandler: async (response) => {
          if (response.status === 204) return null;
          return response.json();
        },
      }),
    }),
    getTeams: builder.query<ITeamListItem[], { take: number; skip: number }>({
      query: ({ take, skip }) => ({
        url: "/Teams",
        params: { take, skip },
      }),
    }),
    getTeamNextMatch: builder.query<ITeamNextMatch | null, number>({
      query: (teamId) => `/Teams/${teamId}/next-match`,
    }),
    getTeamTrophies: builder.query<ITeamTrophy[], number>({
      query: (teamId) => `/Teams/${teamId}/trophies`,
    }),
    getTeamTopPlayers: builder.query<ITeamTopPlayers, number>({
      query: (teamId) => `/Teams/${teamId}/top-players`,
    }),
    getTeamMatches: builder.query<
      ITeamMatchResponse[],
      { teamId: number; isPast: boolean; skip: number; take: number }
    >({
      query: ({ teamId, isPast, skip, take }) => ({
        url: `/Teams/${teamId}/matches`,
        params: { isPast, skip, take },
      }),
    }),
    getTeamTransfers: builder.query<
      ITeamTransfer[],
      { teamId: number; skip: number; take: number }
    >({
      query: ({ teamId, skip, take }) => ({
        url: `/Teams/${teamId}/transfers`,
        params: { skip, take },
      }),
    }),
    getTeamSquad: builder.query<ISquadPlayer[], number>({
      query: (teamId) => `/Teams/${teamId}/squad`,
    }),
  }),
});

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["EventDetail"],
  baseQuery: createErrorHandlingBaseQuery(
    fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      prepareHeaders: (headers) => {
        headers.set("Accept-Language", getApiLocale());

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
    true,
  ),
  endpoints: (builder) => ({
    getUserInfo: builder.query<IPlayerProfile, void>({
      queryFn: async (_, __, ___, baseQuery) => {
        if (typeof window === "undefined") {
          return { error: { status: 401, data: "Not in browser" } };
        }

        const tokens = JSON.parse(
          localStorage.getItem("goalize_auth_tokens") || "null",
        );

        if (!tokens) {
          return { error: { status: 401, data: "No token found" } };
        }
        
        return baseQuery({
          url: "/players/me",
          method: "GET",
        }) as Promise<
          QueryReturnValue<
            IPlayerProfile,
            FetchBaseQueryError,
            FetchBaseQueryMeta
          >
        >;
      },
    }),
    getPlayersInvite: builder.query<PlayerInviteResult[], string>({
      query: (searchText) => ({
        url: `/Search/players-invite`,
        params: { searchText },
      }),
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
    getTeamDraft: builder.query<ITeamDraft, number>({
      query: (teamId) => `/Teams/${teamId}/draft`,
    }),
    deleteTeamDraft: builder.mutation<void, number>({
      query: (teamId) => ({
        url: `/Teams/${teamId}/draft`,
        method: "DELETE",
      }),
    }),
    getTeamInfo: builder.query<ITeam, number>({
      query: (teamId) => `/Teams/${teamId}/info`,
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
    getInAppNotifications: builder.query<
      NotificationItemDto[],
      { skip: number; take: number }
    >({
      query: ({ skip, take }) => ({
        url: "/Notifications/in-app",
        params: { skip, take },
      }),
    }),
    markAllNotificationsSeen: builder.mutation<void, void>({
      query: () => ({
        url: "/Notifications/mark-all-seen",
        method: "POST",
      }),
    }),
    respondToTeamInvitation: builder.mutation<
      void,
      { teamId: number; invitationId: number; status: "Accepted" | "Rejected" }
    >({
      query: ({ teamId, invitationId, status }) => ({
        url: `/Teams/${teamId}/invitations/${invitationId}`,
        method: "PATCH",
        body: { status },
      }),
    }),
    respondToTeamApplication: builder.mutation<
      void,
      { teamId: number; applicationId: number; status: "Accepted" | "Rejected" }
    >({
      query: ({ teamId, applicationId, status }) => ({
        url: `/Teams/${teamId}/applications/${applicationId}`,
        method: "PATCH",
        body: { status },
      }),
    }),
    createTeam: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/Teams",
        method: "POST",
        body: formData,
      }),
    }),
    updateTeam: builder.mutation<void, { teamId: number; formData: FormData }>({
      query: ({ teamId, formData }) => ({
        url: `/Teams/${teamId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    applyToTeam: builder.mutation<void, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/Teams/${teamId}/applications`,
        method: "POST",
      }),
    }),
    updateShirtNumber: builder.mutation<
      void,
      { teamId: number; playerId: number; shirtNumber: number }
    >({
      query: ({ teamId, playerId, shirtNumber }) => ({
        url: `/Teams/${teamId}/members/${playerId}/shirt-number`,
        method: "PUT",
        body: { number: shirtNumber },
      }),
    }),
    getEventById: builder.query<IEventDetail, number>({
      query: (eventId) => `/Events/${eventId}`,
      providesTags: ["EventDetail"],
    }),
    joinEvent: builder.mutation<void, number>({
      query: (eventId) => ({
        url: `/Events/${eventId}/participants`,
        method: "POST",
      }),
      invalidatesTags: ["EventDetail"],
    }),
    unjoinEvent: builder.mutation<void, number>({
      query: (eventId) => ({
        url: `/Events/${eventId}/participants`,
        method: "DELETE",
      }),
      invalidatesTags: ["EventDetail"],
    }),
    createEvent: builder.mutation<void, ICreateEventRequest>({
      query: (body) => ({
        url: "/Events",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(publicApi.util.invalidateTags(["Events"]));
      },
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
  useGetEventsQuery,
  useGetMatchByIdQuery,
  useGetMatchStatsQuery,
  useGetMatchLineupQuery,
  useGetMatchPlayerStatsQuery,
  useGetTeamsQuery,
  useGetTeamNextMatchQuery,
  useGetTeamTrophiesQuery,
  useGetTeamTopPlayersQuery,
  useGetTeamMatchesQuery,
  useGetTeamTransfersQuery,
  useGetTeamSquadQuery,
} = publicApi;

export const {
  useGetUserInfoQuery,
  useLazyGetPlayersInviteQuery,
  useGetPlayerBasicInfoQuery,
  useGetTeamDraftQuery,
  useGetTeamInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useQuitTeamMutation,
  useMakeTeamCaptainMutation,
  useJoinLeagueMutation,
  useUnjoinLeagueMutation,
  useLazyGetInAppNotificationsQuery,
  useMarkAllNotificationsSeenMutation,
  useRespondToTeamInvitationMutation,
  useRespondToTeamApplicationMutation,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useApplyToTeamMutation,
  useUpdateShirtNumberMutation,
  useDeleteTeamDraftMutation,
  useCreateEventMutation,
  useGetEventByIdQuery,
  useJoinEventMutation,
  useUnjoinEventMutation,
} = api;

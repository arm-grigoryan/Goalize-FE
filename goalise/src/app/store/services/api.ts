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
import { ITransfers, ITeamTransfer } from "@/types/api/transfers";
import { ILeague } from "@/types/api/leagues";
import { ILeaguesGroup } from "@/types/api/leaguesGroup";
import { ILeaguesResults } from "@/types/api/leaguesResults";
import { ITeam, ITeamJoined, ITeamListItem, ITeamNextMatch, ITeamTrophy } from "@/types/api/temas";
import { IPlayerProfile } from "@/types/api/userInfo";
import type { SearchResponse } from "@/types/api/search";
import { IPlayerStats } from "@/types/api/playerStats";
import { IPlayerTransferHistory } from "@/types/api/playerTransferHistory";
import { IPlayerProfileMatches } from "@/types/api/PlayerProfilMatches";
import { IDrowStandings } from "@/types/api/drowStandings";
import { ITopPlayers, ITeamTopPlayers } from "@/types/api/topPlayers";
import { ITeamMatchResponse } from "@/types/api/teamMatches";
import { ISquadPlayer } from "@/types/api/squad";
import { startLoginRedirect } from "@/shared/auth/oidcService";
import { setError } from "../slices/errorSlice";
import { NotificationItemDto } from "@/types/api/notifications";

let is401HandlingInProgress = false;

const handle401Error = () => {
  if (typeof window === "undefined") return;

  if (is401HandlingInProgress) return;
  is401HandlingInProgress = true;

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
    const response = await baseQuery(args, api, extraOptions);

    if (response.error) {
      const status = (response.error as FetchBaseQueryError).status;

      if (isAuthenticatedApi && status === 401) {
        handle401Error();
      }

      if (status === 403 || (typeof status === "number" && status >= 500)) {
        if (status === 403) {
          window.dispatchEvent(new CustomEvent("app:403"));
        }
        if (typeof status === "number" && status >= 500) {
          api.dispatch(
            setError({
              errorType: "5xx",
              message: "Something went wrong,Please try again later.",
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
    getEventById: builder.query<unknown, number>({
      query: (eventId) => `/Events/${eventId}`,
    }),
    getMatchById: builder.query<IMatches, number>({
      query: (matchId) => `/Matches/${matchId}`,
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
    getTeamDraft: builder.query<unknown, number>({
      query: (teamId) => `/Teams/${teamId}/draft`,
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
  useGetEventByIdQuery,
  useGetMatchByIdQuery,
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
} = api;

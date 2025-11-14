import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UpcomingMatch } from "../../../types/api/upComingMatches";
import { IMatchesPast } from "@/types/api/matchesPast";
import { ITransfers } from "@/types/api/transfers";
import { ILeague } from "@/types/api/leagues";
import { ILeaguesGroup } from "@/types/api/leaguesGroup";
import { ILeaguesResults } from "@/types/api/leaguesResults";
import { ITeam } from "@/types/api/temas";
import { IPlayerProfile } from "@/types/api/userInfo";

const STATIC_TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVBMkI5QzBDNTkxMzc5MDE1QjUzQ0I5QjE5MkIyNTA4IiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL2F1dGgtZ29hbGl6ZS5kdWNrZG5zLm9yZyIsIm5iZiI6MTc2MzE1MzA4NSwiaWF0IjoxNzYzMTUzMDg1LCJleHAiOjE3NjMxNTY2ODUsImF1ZCI6Imh0dHBzOi8vYXV0aC1nb2FsaXplLmR1Y2tkbnMub3JnL3Jlc291cmNlcyIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsInBob25lIl0sImFtciI6WyJwd2QiXSwiY2xpZW50X2lkIjoiS2lja29mZi1Td2FnZ2VyIiwic3ViIjoiOGI0NTMzYjQtNzkwYy00MzhkLTgzYjMtMWFhMzg3MDAyYjUxIiwiYXV0aF90aW1lIjoxNzYzMDY2ODk1LCJpZHAiOiJsb2NhbCIsImdpdmVuX25hbWUiOiJBcm1lbiIsImZhbWlseV9uYW1lIjoiR3JpZ29yeWFuIiwibmFtZSI6IkFybWVuIEdyaWdvcnlhbiIsImVtYWlsIjoiYXJtZW5ncmlnb3J5YW4yNDRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiXHUwMDJCMzc0OTYwMDM3MTAiLCJyb2xlIjoiQWRtaW4iLCJzaWQiOiJENDYwMzZDQTE3MjAxRDA0RkJBNEFDNEQzRjA0NzFDNyIsImp0aSI6IkU4MDZCNTM4OEQzNjExREQ1NURFQTQ3QzYwRjQzRDBBIn0.unKymvoMLNgJ4yr-5fnXNL8OI0dyFRPmSmIvzGOPkLzsuoqiippJ9khbj0biLPIfzmmY9if5yqbOrfwXUu9Wyx81rdadZgDgahmCw6l9_ofVO_kvvIZhtdlpBoX-eNBwnuyv3W9yt5tB6y17btqpHI4K42XWmtp1zhpLZtHP5MqwZ7OdiX0pikeUoRZoeauSUcuutn9cJjxy5uKRNIshHMOCxpYNlfakeo8yBhYc48LT2fps617keqxnYUbGBzUGyI-DBvn87qtIUPoE5f3Pf1M5LKRnANqf4ZNpjQ4fY4ZuP1slDSbK7NJtRAk1EcvJ5zg7Y8ANAQPx-lTz8u-oHw";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${STATIC_TOKEN}`);
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
} = api;

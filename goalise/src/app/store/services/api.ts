import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UpcomingMatch } from "../../../types/api/upComingMatches";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://194.233.89.194:5000/api",
  }),
  endpoints: (builder) => ({
    upComingMatches: builder.query<UpcomingMatch[], void>({
      query: () => "/matches/upcoming",
    }),
    getPostById: builder.query<unknown, number>({
      query: (id) => `/posts/${id}`,
    }),
  }),
});

export const { useUpComingMatchesQuery, useGetPostByIdQuery } = api;

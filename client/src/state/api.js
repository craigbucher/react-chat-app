import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// construct api call
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),  // from .env
  reducerPath: "main",  // name of this particular slice (part of redux store)
  tagTypes: [], // where data is saved; don't need to do this, since we immediately POST it to backend
  endpoints: (build) => ({  // create api queries
    postAiText: build.mutation({  // build.mutation = make a POST api call
      query: (payload) => ({  // define query payload
        url: "openai/text", // http://localhost:1337/openai/text
        method: "POST",
        body: payload,  // where does payload come from ???????
      }),
    }),
    postAiCode: build.mutation({
      query: (payload) => ({
        url: "openai/code", // http://localhost:1337/openaicode
        method: "POST",
        body: payload,
      }),
    }),
    postAiAssist: build.mutation({
      query: (payload) => ({
        url: "openai/assist", // http://localhost:1337/openai/assist
        method: "POST",
        body: payload,
      }),
    }),
    postLogin: build.mutation({
      query: (payload) => ({
        url: "auth/login",  // http://localhost:1337/auth/login
        method: "POST",
        body: payload,
      }),
    }),
    postSignUp: build.mutation({
      query: (payload) => ({
        url: "auth/signup", // http://localhost:1337/auth/signup
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  usePostAiTextMutation,  // execute the api call (called from other component); POST calls always start with 'use' (get is different)
  usePostAiCodeMutation,
  usePostAiAssistMutation,
  usePostLoginMutation,
  usePostSignUpMutation,
} = api;

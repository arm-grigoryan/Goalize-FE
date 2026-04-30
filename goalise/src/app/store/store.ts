import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api, publicApi } from "./services/api";
import errorReducer from "./slices/errorSlice";
import localeReducer from "./slices/localeSlice";
import eventsReducer from "./slices/eventsSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    error: errorReducer,
    locale: localeReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(publicApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

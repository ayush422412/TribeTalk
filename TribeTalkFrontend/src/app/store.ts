import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "../features/servers/server.slice";
import channelReducer from "../features/channels/channel.slice";
import messageReducer from "../features/messages/message.slice";
import { baseApi } from "../features/api/baseApi";
import { authApi } from "../features/auth/auth.api" // import the new authApi RTK Query slice

import auth from "../features/auth/authStore/auth.slice"

export const store = configureStore({
  reducer: {
    auth,
    server: serverReducer,
    channel: channelReducer,
    message: messageReducer,
    [baseApi.reducerPath]: baseApi.reducer, // <-- add this
    [authApi.reducerPath]: authApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)   // must add baseApi middleware
      .concat(authApi.middleware),  // must add authApi middleware
});

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

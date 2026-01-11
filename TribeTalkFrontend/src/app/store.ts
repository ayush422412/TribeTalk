import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "../stores/server.slice";
import channelReducer from "../stores/channel.slice";
import messageReducer from "../stores/message.slice"; 

export const store = configureStore({
  reducer: {
    server: serverReducer,
    channel: channelReducer,
    message: messageReducer, 
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

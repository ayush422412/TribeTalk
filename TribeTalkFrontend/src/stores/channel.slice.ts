import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Channel, ChannelState } from './types'
import {  sampleChannelsByServer } from "./sampleData"

// uncomment this code to use actual data instead of filler
// const initialState: ChannelState = {
//   channelsByServer: {},
//   activeChannelId: null
// }


// comment this code to use actual data instead of filler
const initialState: ChannelState = {
  channelsByServer: sampleChannelsByServer,
  activeChannelId: null,
}

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelsForServer(
      state,
      action: PayloadAction<{ serverId: number; channels: Channel[] }>
    ) {
      state.channelsByServer[action.payload.serverId] =
        action.payload.channels
    },
    setActiveChannel(state, action: PayloadAction<number>) {
      state.activeChannelId = action.payload
    }
  }
})

export const { setChannelsForServer, setActiveChannel } =
  channelSlice.actions
export default channelSlice.reducer

// features/channels/channel.slice.ts (FIXED)
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Channel, ChannelState } from '../types'
import { sampleChannelsByServer } from "../sampleData"

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
      action: PayloadAction<{ serverId: string; channels: Channel[] }>  // FIXED: number → string
    ) {
      state.channelsByServer[action.payload.serverId] = action.payload.channels
    },
    
    setActiveChannel(state, action: PayloadAction<string>) {  // FIXED: number → string
      state.activeChannelId = action.payload
    },
    
    // NEW: Add a single channel to a server (for optimistic updates)
    addChannelToServer(
      state,
      action: PayloadAction<{ serverId: string; channel: Channel }>
    ) {
      const { serverId, channel } = action.payload
      if (!state.channelsByServer[serverId]) {
        state.channelsByServer[serverId] = []
      }
      state.channelsByServer[serverId].push(channel)
    }
  }
})

export const { setChannelsForServer, setActiveChannel, addChannelToServer } =
  channelSlice.actions
export default channelSlice.reducer
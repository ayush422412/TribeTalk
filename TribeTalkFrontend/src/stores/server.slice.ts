import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Server, ServerState } from './types'
import { sampleServers } from "./sampleData"

// uncomment this code to use actual data instead of filler
// const initialState: ServerState = {
//   servers: [],
//   activeServerId: null
// }

// comment this code to use actual data instead of filler
const initialState: ServerState = {
  servers: sampleServers,
  activeServerId: null,
}

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setServers(state, action: PayloadAction<Server[]>) {
      state.servers = action.payload
    },
    setActiveServer(state, action: PayloadAction<number>) {
      state.activeServerId = action.payload
    }
  }
})

export const { setServers, setActiveServer } = serverSlice.actions
export default serverSlice.reducer

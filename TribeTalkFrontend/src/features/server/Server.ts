import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Channel {
  id: number;
  name: string;
}

interface Server {
  id: number;
  name: string;
  channels: Channel[];
}

const initialState: Server = {
    id: 0,
    name: 'null',
    channels: []
}

export const ServerSlice = createSlice({
  name: 'Server',
  initialState,
  reducers: {
    changeserver: (state, action: PayloadAction<Server>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.id = action.payload.id,
      state.name = action.payload.name,
      state.channels = action.payload.channels
    },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { changeserver } = ServerSlice.actions

export default ServerSlice.reducer
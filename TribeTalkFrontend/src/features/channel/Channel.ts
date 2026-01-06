import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

interface Channel {
  id: number;
  name: string;
  description: string;
  members : string[];
}



const initialState: Channel = {
    id: 0,
    name: 'null',
    description: 'null',
    members: [],
   
}


export const ChannelSlice = createSlice({
  name: 'Channel',
  initialState,
  reducers: {
    changeChannel: (state, action: PayloadAction<Channel>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.id = action.payload.id,
      state.name = action.payload.name,
      state.description = action.payload.description,
      state.members = action.payload.members
    },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})
    

export const { changeChannel } = ChannelSlice.actions

export default ChannelSlice.reducer









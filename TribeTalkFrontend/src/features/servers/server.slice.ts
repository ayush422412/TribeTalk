// features/servers/server.slice.ts
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
type ServerUIState = {
  activeServerId: string | null
}

const initialState: ServerUIState = {
  activeServerId: null
}

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setActiveServer(state, action: PayloadAction<string>) {
      state.activeServerId = action.payload
    }
  }
})

export const { setActiveServer } = serverSlice.actions
export default serverSlice.reducer

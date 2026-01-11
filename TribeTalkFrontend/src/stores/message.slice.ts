import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Message, MessageState } from "./types"

const initialState: MessageState = {
  messagesByChannel: {}
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /**
     * Replace all messages for a channel.
     * Called when user first joins a channel or fetches previous messages.
     */
    setMessagesForChannel(
      state,
      action: PayloadAction<{ channelId: number; messages: Message[] }>
    ) {
      state.messagesByChannel[action.payload.channelId] =
        action.payload.messages
    },

    /**
     * Add a single message to a channel.
     * Called when a new message is sent or received in real-time.
     */
    addMessage(
      state,
      action: PayloadAction<{ channelId: number; message: Message }>
    ) {
      const { channelId, message } = action.payload
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = []
      }
      state.messagesByChannel[channelId].push(message)
    },

    /**
     * Update an existing message (e.g., edit)
     */
    editMessage(
      state,
      action: PayloadAction<{ channelId: number; message: Message }>
    ) {
      const { channelId, message } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return
      const index = messages.findIndex(m => m.id === message.id)
      if (index !== -1) {
        messages[index] = message
      }
    },

    /**
     * Delete a message from a channel
     */
    deleteMessage(
      state,
      action: PayloadAction<{ channelId: number; messageId: number }>
    ) {
      const { channelId, messageId } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return
      state.messagesByChannel[channelId] = messages.filter(
        m => m.id !== messageId
      )
    }
  }
})

export const { setMessagesForChannel, addMessage, editMessage, deleteMessage } =
  messageSlice.actions
export default messageSlice.reducer

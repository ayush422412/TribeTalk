// features/messages/message.slice.ts (FIXED - string channel IDs)
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Message, MessageState } from "../types"

const MAX_MESSAGES_PER_CHANNEL = 100

const initialState: MessageState = {
  messagesByChannel: {}
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /**
     * Replace all messages for a channel.
     */
    setMessagesForChannel(
      state,
      action: PayloadAction<{ channelId: string; messages: Message[] }>  // FIXED: number → string
    ) {
      const { channelId, messages } = action.payload
      // Keep only last 100 messages
      state.messagesByChannel[channelId] = messages.slice(-MAX_MESSAGES_PER_CHANNEL)
    },

    /**
     * Add a single message to a channel.
     */
    addMessage(
      state,
      action: PayloadAction<{ channelId: string; message: Message }>  // FIXED: number → string
    ) {
      const { channelId, message } = action.payload
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = []
      }
      
      const messages = state.messagesByChannel[channelId]
      
      // Avoid duplicates
      const exists = messages.some(m => m.id === message.id)
      if (!exists) {
        messages.push(message)
      }
      
      // Trim to last 100 messages if exceeded
      if (messages.length > MAX_MESSAGES_PER_CHANNEL) {
        state.messagesByChannel[channelId] = messages.slice(-MAX_MESSAGES_PER_CHANNEL)
      }
    },

    /**
     * Update an existing message (e.g., edit)
     */
    editMessage(
      state,
      action: PayloadAction<{ channelId: string; message: Message }>  // FIXED: number → string
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
      action: PayloadAction<{ channelId: string; messageId: number }>  // FIXED: number → string
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
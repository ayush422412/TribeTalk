// features/messages/message.slice.ts (UPDATED)
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Message, MessageState } from "../types"

const MAX_MESSAGES_PER_CHANNEL = 100

const initialState: MessageState = {
  messagesByChannel: {},
  editingMessageId: null,
  typingUsers: {},
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /**
     * Set messages for a channel (from REST API or initial sync)
     */
setMessagesForChannel(
  state,
  action: PayloadAction<{ channelId: string; messages: Message[] }>
) {
  const { channelId, messages } = action.payload

  state.messagesByChannel[channelId] = [...messages]
    .sort((a, b) => a.sequence - b.sequence)
    .slice(-MAX_MESSAGES_PER_CHANNEL)
},
    /**
     * Prepend older messages (for infinite scroll up)
     */
    prependMessages(
      state,
      action: PayloadAction<{ channelId: string; messages: Message[] }>
    ) {
      const { channelId, messages } = action.payload
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = []
      }
      
      const existing = state.messagesByChannel[channelId]
      const newMessages = messages.filter(
        (msg) => !existing.some((m) => m.id === msg.id)
      )
      
      state.messagesByChannel[channelId] = [...newMessages, ...existing]
        .sort((a, b) => a.sequence - b.sequence)
        .slice(-MAX_MESSAGES_PER_CHANNEL)
    },

    /**
     * Add a single message (real-time or optimistic)
     */
    addMessage(
      state,
      action: PayloadAction<{ channelId: string; message: Message }>
    ) {
      const { channelId, message } = action.payload
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = []
      }

      const messages = state.messagesByChannel[channelId]

      // Check if message already exists
      const exists = messages.some((m) => m.id === message.id)
      if (!exists) {
        messages.push(message)
        
        // Keep sorted by sequence
        messages.sort((a, b) => a.sequence - b.sequence)

        // Trim to last 100 messages
        if (messages.length > MAX_MESSAGES_PER_CHANNEL) {
          state.messagesByChannel[channelId] = messages.slice(-MAX_MESSAGES_PER_CHANNEL)
        }
      }
    },

    /**
     * Replace optimistic message with real one from server
     */
    replaceMessage(
      state,
      action: PayloadAction<{ channelId: string; clientId: string; message: Message }>
    ) {
      const { channelId, clientId, message } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return

      const index = messages.findIndex((m) => m.clientId === clientId)
      if (index !== -1) {
        messages[index] = message
      }
    },

    /**
     * Update an existing message (edit)
     */
    editMessage(
      state,
      action: PayloadAction<{ channelId: string; message: Message }>
    ) {
      const { channelId, message } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return

      const index = messages.findIndex((m) => m.id === message.id)
      if (index !== -1) {
        messages[index] = message
      }
    },

    /**
     * Delete a message from a channel
     */
    deleteMessage(
      state,
      action: PayloadAction<{ channelId: string; messageId: string }>
    ) {
      const { channelId, messageId } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return

      const index = messages.findIndex((m) => m.id === messageId)
      if (index !== -1) {
        // Replace with deleted placeholder
        messages[index] = {
          ...messages[index],
          content: "[Message deleted]",
          deletedAt: new Date().toISOString(),
        }
      }
    },

    /**
     * Mark a message as failed
     */
    markMessageFailed(
      state,
      action: PayloadAction<{ channelId: string; clientId: string }>
    ) {
      const { channelId, clientId } = action.payload
      const messages = state.messagesByChannel[channelId]
      if (!messages) return

      const message = messages.find((m) => m.clientId === clientId)
      if (message) {
        message.isFailed = true
        message.isPending = false
      }
    },

    /**
     * Set which message is being edited
     */
    setEditingMessage(state, action: PayloadAction<string | null>) {
      state.editingMessageId = action.payload
    },

    /**
     * Add typing user to a channel
     */
    addTypingUser(
      state,
      action: PayloadAction<{ channelId: string; userId: string; username: string }>
    ) {
      const { channelId, userId, username } = action.payload
      if (!state.typingUsers[channelId]) {
        state.typingUsers[channelId] = []
      }
      if (!state.typingUsers[channelId].includes(username)) {
        state.typingUsers[channelId].push(username)
      }
    },

    /**
     * Remove typing user from a channel
     */
    removeTypingUser(
      state,
      action: PayloadAction<{ channelId: string; userId: string }>
    ) {
      const { channelId } = action.payload
      if (state.typingUsers[channelId]) {
        // For simplicity, clear all typing users when one stops
        // In production, you'd track by userId
        delete state.typingUsers[channelId]
      }
    },

    /**
     * Clear all messages for a channel (when leaving)
     */
    clearChannelMessages(state, action: PayloadAction<string>) {
      delete state.messagesByChannel[action.payload]
      delete state.typingUsers[action.payload]
    },
  },
})

export const {
  setMessagesForChannel,
  prependMessages,
  addMessage,
  replaceMessage,
  editMessage,
  deleteMessage,
  markMessageFailed,
  setEditingMessage,
  addTypingUser,
  removeTypingUser,
  clearChannelMessages,
} = messageSlice.actions

export default messageSlice.reducer
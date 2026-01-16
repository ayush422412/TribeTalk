// features/messages/message.api.ts
import { baseApi } from "../api/baseApi"
import type { Message } from "../types"

type ApiResponse<T> = {
  statusCode: number
  data: T
  message: string
  success?: boolean
}

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get message history (cursor-based pagination)
    getMessageHistory: builder.query<
      { messages: Message[]; hasMore: boolean; cursor: string | null },
      { channelId: string; limit?: number; before?: string; after?: string }
    >({
      query: ({ channelId, limit = 50, before, after }) => {
        const params = new URLSearchParams({ limit: limit.toString() })
        if (before) params.append("before", before)
        if (after) params.append("after", after)
        return `/messages/${channelId}/messages?${params.toString()}`
      },
      transformResponse: (response: ApiResponse<{
        messages: any[]
        hasMore: boolean
        cursor: string | null
      }>) => {
        // Transform backend message format to frontend format
        const messages = response.data.messages.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          senderId: msg.sender._id || msg.sender,
          senderUsername: msg.sender.username || null,
          senderAvatar: msg.sender.avatar || null,
          channelId: msg.channel,
          sequence: msg.sequence,
          timestamp: msg.createdAt,
          isEdited: msg.isEdited,
          editedAt: msg.editedAt || null,
          isSystemMessage: msg.isSystemMessage || false,
          clientId: msg.clientId || null,
        }))
        return {
          messages,
          hasMore: response.data.hasMore,
          cursor: response.data.cursor,
        }
      },
    }),

    // Get sync data for a channel
    getChannelSyncData: builder.query<
      { latestMessageId: string | null; latestSequence: number; unreadCount: number },
      string
    >({
      query: (channelId) => `/messages/${channelId}/sync`,
      transformResponse: (response: ApiResponse<any>) => response.data,
    }),

    // Mark channel as read
    markChannelAsRead: builder.mutation<
      void,
      { channelId: string; lastReadMessageId?: string }
    >({
      query: ({ channelId, lastReadMessageId }) => ({
        url: `/messages/${channelId}/mark-read`,
        method: "POST",
        body: { lastReadMessageId },
      }),
    }),
  }),
})

export const {
  useGetMessageHistoryQuery,
  useLazyGetMessageHistoryQuery,
  useGetChannelSyncDataQuery,
  useMarkChannelAsReadMutation,
} = messageApi
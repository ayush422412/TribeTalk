// types.ts (FIXED - all IDs are now strings)

export interface Channel {
  _id: string
  name: string
  type: "text" | "voice"
  description?: string
  server: string | ServerSummary  // string when creating, full object when fetching
  createdBy: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface ChannelState {
  channelsByServer: Record<string, Channel[]>
  activeChannelId: string | null  // FIXED: was number, now string
}

export type ServerRole = "owner" | "moderator" | "member" 

export interface ServerSummary {
  _id: string
  name: string
  description?: string
  owner?: string
}

export interface ServerFull extends ServerSummary {
  moderators: string[]
  members: string[]
  channels: Channel[]
}

export interface Message {
  id: number
  content: string
  senderId: number
  channelId: string  // FIXED: was number, now string to match Channel._id
  timestamp?: string
}

export interface MessageState {
  messagesByChannel: Record<string, Message[]>  // FIXED: was number, now string
}
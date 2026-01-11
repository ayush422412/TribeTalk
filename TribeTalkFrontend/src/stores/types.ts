export interface Channel {
  id: number
  name: string
  serverId: number
}

export interface ChannelState {
  channelsByServer: Record<number, Channel[]>
  activeChannelId: number | null
}

export interface Server {
  id: number
  name: string
}

export interface ServerState {
  servers: Server[]
  activeServerId: number | null
}

export interface Message {
  id: number
  content: string
  senderId: number
  channelId: number
  timestamp?: string // optional, useful for sorting
}

export interface MessageState {
  messagesByChannel: Record<number, Message[]>
}


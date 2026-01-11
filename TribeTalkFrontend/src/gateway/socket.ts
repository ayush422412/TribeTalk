// gateway/socket.ts

import { io, Socket } from "socket.io-client"
import type { Channel, Server, Message } from "../stores/types"

/**
 * SocketGateway
 *
 * This class is the single source of truth for:
 * - Socket.io connection
 * - Emitting domain-specific socket events
 * - Registering socket listeners
 *
 * The rest of the app should NEVER:
 * - call socket.emit directly
 * - use raw event strings
 */
class SocketGateway {
  /**
   * Holds the active socket.io connection.
   * It is null until connect() is called.
   */
  private socket: Socket | null = null

  /**
   * Establishes a socket.io connection with the backend.
   * Called once during app bootstrap (after auth).
   */
  connect(token: string) {
    this.socket = io("http://localhost:3000", {
      auth: { token }
    })
  }

  /**
   * Ensures the socket is connected before emitting events.
   * Helps catch bugs early during development.
   */
  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error("Socket not connected")
    }
    return this.socket
  }



  // ======================
  // Channel-related events
  // ======================

  /**
   * Requests the backend to join a channel.
   * Backend will:
   * - validate permissions
   * - join the socket to the channel room
   */
  joinChannel(channelId: number) {
    const socket = this.getSocket()
    socket.emit("join_channel", { channelId })
  }

  /**
   * Requests the backend to leave a channel.
   * Used when switching channels or servers.
   */
  leaveChannel(channelId: number) {
    const socket = this.getSocket()
    socket.emit("leave_channel", { channelId })

  }

  // ======================
  // Message-related events
  // ======================

  /**
   * Sends a message to a channel.
   * The backend will:
   * - validate channel access
   * - verify room membership
   * - persist the message
   * - broadcast it to the channel room
   */
  sendMessage(payload: { channelId: number; content: string }) {
    const socket = this.getSocket()
    socket.emit("send_message", payload)

  }

  // ======================
  // Incoming socket events
  // ======================

  /**
   * Listens for the list of servers the user belongs to.
   * Usually sent after connecting or re-authenticating.
   */
  onServers(handler: (servers: Server[]) => void) {
    this.socket?.on("servers", handler)
  }

  /**
   * Listens for channels belonging to a server.
   * Used when switching servers or on initial load.
   */
  onChannels(
    handler: (data: { serverId: number; channels: Channel[] }) => void
  ) {
    this.socket?.on("channels", handler)
  }

  /**
   * Listens for new messages in the active channel.
   * Fired when any user sends a message to the channel.
   */
  onMessage(handler: (message: Message) => void) {
    this.socket?.on("new_message", handler)
  }


  /**
 * Registers a listener for new messages
 */
onNewMessage(handler: (message: Message) => void) {
  this.socket?.on("new_message", handler)
}

/**
 * Registers a listener for edited messages
 */
onMessageEdited(handler: (message: Message) => void) {
  this.socket?.on("message_edited", handler)
}

/**
 * Registers a listener for deleted messages
 */
onMessageDeleted(handler: (data: { channelId: number; messageId: number }) => void) {
  this.socket?.on("message_deleted", handler)
}
/**
 * Registers a listener for bulk messages for a channel
 */
onMessages(handler: (data: { channelId: number; messages: Message[] }) => void) {
  this.socket?.on("messages", handler)
}
/**
 * Requests messages for a specific channel
 * Returns a one-time listener promise
 */
getMessagesForChannel(channelId: number): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    const socket = this.getSocket()
    socket.emit("get_messages", { channelId })
    socket.once(`messages_for_${channelId}`, (messages: Message[]) => resolve(messages))
    setTimeout(() => reject(new Error("Timeout fetching messages")), 5000)
  })}

  // ======================
  // Connection lifecycle
  // ======================

  /**
   * Fired when the socket successfully connects.
   * Useful for resyncing state.
   */
  onConnect(handler: () => void) {
    this.socket?.on("connect", handler)
  }

  /**
   * Fired when the socket disconnects.
   * Useful for showing offline UI.
   */
  onDisconnect(handler: () => void) {
    this.socket?.on("disconnect", handler)
  }

  /**
   * Removes socket listeners.
   * Critical to prevent memory leaks and duplicated events.
   */
  off(event: string, handler?: (...args: any[]) => void) {
    this.socket?.off(event, handler)
  }
  
}

/**
 * Singleton instance used throughout the app.
 * There should only ever be ONE socket connection.
 */
export const socketGateway = new SocketGateway()

// features/messages/socketMessageSync.ts (FIXED - string channel IDs)

import { socketGateway } from "../../gateway/socket"
import { addMessage, editMessage, deleteMessage, setMessagesForChannel } from "./message.slice"
import type { AppDispatch } from "../../app/store"
import type { Message } from "../types"

const MAX_MESSAGES_PER_CHANNEL = 100

/**
 * Sets up all socket listeners for real-time message updates.
 * This should be called ONCE when the app initializes (after auth).
 */
export function initializeMessageSync(dispatch: AppDispatch) {
  
  /**
   * Listen for new messages in any channel
   */
  socketGateway.onNewMessage((message: Message) => {
    dispatch(addMessage({ channelId: message.channelId, message }))
  })

  /**
   * Listen for edited messages
   */
  socketGateway.onMessageEdited((message: Message) => {
    dispatch(editMessage({ channelId: message.channelId, message }))
  })

  /**
   * Listen for deleted messages
   */
  socketGateway.onMessageDeleted((data: { channelId: string; messageId: number }) => {  // FIXED
    dispatch(deleteMessage(data))
  })

  /**
   * Listen for bulk messages (when joining a channel)
   */
  socketGateway.onMessages((data: { channelId: string; messages: Message[] }) => {  // FIXED
    // Keep only last 100 messages
    const trimmedMessages = data.messages.slice(-MAX_MESSAGES_PER_CHANNEL)
    dispatch(setMessagesForChannel({ 
      channelId: data.channelId, 
      messages: trimmedMessages 
    }))
  })
}

/**
 * Cleanup socket listeners when app unmounts (logout, etc.)
 */
export function cleanupMessageSync() {
  socketGateway.off("new_message")
  socketGateway.off("message_edited")
  socketGateway.off("message_deleted")
  socketGateway.off("messages")
}
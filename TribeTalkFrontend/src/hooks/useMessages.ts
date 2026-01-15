// hooks/useMessages.ts (FIXED - string channel IDs)

import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { socketGateway } from "../gateway/socket"

/**
 * Thin hook - just selects messages from Redux
 * All socket logic is in socketMessageSync.ts
 */
export function useMessages(channelId: string | null) {  // FIXED: number → string
  const messages = useSelector((state: RootState) =>
    channelId ? state.message.messagesByChannel[channelId] : []
  ) || []

  /**
   * Send a message via socket
   * Backend will broadcast it, and we'll receive it via socket listener
   */
  function sendMessage(content: string) {
    if (!channelId) return
    socketGateway.sendMessage({ channelId, content })
  }

  return { messages, sendMessage }
}
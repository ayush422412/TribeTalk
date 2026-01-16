// hooks/useChannelSync.ts (NEW)
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { socketGateway } from "../gateway/socket"
import { useLazyGetMessageHistoryQuery } from "../features/messages/message.api"
import { setMessagesForChannel, clearChannelMessages } from "../features/messages/message.slice"

/**
 * Hook to handle joining/leaving channels and syncing messages
 * Combines socket join + REST API history fetch
 */
export function useChannelSync(channelId: string | null) {
  const dispatch = useDispatch()
  const [fetchHistory] = useLazyGetMessageHistoryQuery()

  useEffect(() => {
    if (!channelId) return

    console.log(`🔌 Joining channel: ${channelId}`)

    // Get last known sequence from localStorage (for reconnect)
    const lastKnownSequence = getLastKnownSequence(channelId)

    // 1. Join the socket room
    socketGateway.joinChannel(channelId, lastKnownSequence)

    // 2. Fetch initial message history via REST
    fetchHistory({ channelId, limit: 50 })
      .unwrap()
      .then(({ messages }) => {
        console.log(`📥 Loaded ${messages.length} messages from REST`)
        dispatch(setMessagesForChannel({ channelId, messages }))

        // Store the latest sequence
        if (messages.length > 0) {
          const latestSequence = Math.max(...messages.map((m) => m.sequence))
          saveLastKnownSequence(channelId, latestSequence)
        }
      })
      .catch((error) => {
        console.error("❌ Failed to fetch message history:", error)
      })

    // Cleanup on unmount or channel change
    return () => {
      console.log(`🔌 Leaving channel: ${channelId}`)
      socketGateway.leaveChannel(channelId)
      // Optionally clear messages from Redux
      // dispatch(clearChannelMessages(channelId))
    }
  }, [channelId, dispatch, fetchHistory])
}

// ============================================
// HELPERS - LocalStorage for sequence tracking
// ============================================

function getLastKnownSequence(channelId: string): number {
  const stored = localStorage.getItem(`channel_seq_${channelId}`)
  return stored ? parseInt(stored, 10) : 0
}

function saveLastKnownSequence(channelId: string, sequence: number): void {
  localStorage.setItem(`channel_seq_${channelId}`, sequence.toString())
}
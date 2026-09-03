// hooks/useChannelSync.ts
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLazyGetMessageHistoryQuery } from "../features/messages/message.api"
import { setMessagesForChannel } from "../features/messages/message.slice"
import { socketGateway } from "../gateway/socket"

export function useChannelSync(channelId: string | null) {
  const dispatch = useDispatch()
  const [fetchHistory] = useLazyGetMessageHistoryQuery()

  useEffect(() => {
    if (!channelId) return

    // 1. Join socket room immediately
    socketGateway.joinChannel(channelId)

    // 2. Fetch baseline REST history
    fetchHistory({ channelId, limit: 50 })
      .unwrap()
      .then((data) => {
        // Formatted messages from data (handles ApiResponse wrapper if present)
        const messages = Array.isArray(data) ? data : data?.messages || []
        
        // 3. Merges with any socket messages that arrived while request was in-flight
        dispatch(setMessagesForChannel({ channelId, messages }))
      })
      .catch((err) => {
        console.error("❌ Failed to fetch message history:", err)
      })

    return () => {
      socketGateway.leaveChannel(channelId)
    }
  }, [channelId, fetchHistory, dispatch])
}
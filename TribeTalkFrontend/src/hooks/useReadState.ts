// hooks/useReadState.ts (NEW)
import { useEffect, useRef, useCallback } from "react"
import { socketGateway } from "../gateway/socket"
import { useMarkChannelAsReadMutation } from "../features/messages/message.api"
import type { Message } from "../features/types"

interface UseReadStateProps {
  channelId: string | null
  messages: Message[]
  isVisible: boolean  // Is the message container visible/in view
}

/**
 * Hook to automatically mark messages as read
 * Tracks visibility and marks channel as read when appropriate
 */
export function useReadState({ channelId, messages, isVisible }: UseReadStateProps) {
  const [markAsReadMutation] = useMarkChannelAsReadMutation()
  const lastReadMessageIdRef = useRef<string | null>(null)
  const markAsReadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Mark the channel as read (debounced)
   */
  const markAsRead = useCallback((messageId?: string) => {
    if (!channelId) return

    // Clear existing timeout
    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current)
    }

    // Debounce mark-as-read by 1 second
    markAsReadTimeoutRef.current = setTimeout(() => {
      const lastMessageId = messageId || messages[messages.length - 1]?.id

      // Don't mark if we've already marked this message
      if (lastMessageId && lastMessageId !== lastReadMessageIdRef.current) {
        console.log(`✅ Marking channel ${channelId} as read up to ${lastMessageId}`)

        // Send via socket (real-time)
        socketGateway.markAsRead(channelId, lastMessageId)

        // Also send via REST (persistence)
        markAsReadMutation({ channelId, lastReadMessageId: lastMessageId })
          .catch((error) => {
            console.error("Failed to mark as read:", error)
          })

        lastReadMessageIdRef.current = lastMessageId
      }
    }, 1000)
  }, [channelId, messages, markAsReadMutation])

  /**
   * Mark as read when new messages arrive and user is viewing the channel
   */
  useEffect(() => {
    if (channelId && messages.length > 0 && isVisible) {
      markAsRead()
    }
  }, [channelId, messages.length, isVisible, markAsRead])

  /**
   * Mark as read when channel first opens
   */
  useEffect(() => {
    if (channelId && messages.length > 0) {
      markAsRead()
    }
  }, [channelId]) // Only run when channel changes

  /**
   * Mark as read when window gains focus
   */
  useEffect(() => {
    if (!channelId) return

    const handleFocus = () => {
      if (messages.length > 0 && isVisible) {
        markAsRead()
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [channelId, messages.length, isVisible, markAsRead])

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (markAsReadTimeoutRef.current) {
        clearTimeout(markAsReadTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Manually mark as read (for user actions like sending a message)
   */
  const manualMarkAsRead = useCallback(() => {
    if (messages.length > 0) {
      markAsRead(messages[messages.length - 1].id)
    }
  }, [messages, markAsRead])

  return {
    markAsRead: manualMarkAsRead,
  }
}
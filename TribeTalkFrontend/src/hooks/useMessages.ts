import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "../app/store"
import type { RootState } from "../app/store"
import { addMessage } from "../stores/message.slice"
import { fetchMessagesForChannel } from "../stores/message.thunks"
import { socketGateway } from "../gateway/socket"
import type { Message } from "../stores/types"

export function useMessages(channelId: number | null) {
  const dispatch = useDispatch<AppDispatch>()

  const messages = useSelector((state: RootState) =>
    channelId ? state.message.messagesByChannel[channelId] : []
  ) || []

  useEffect(() => {
    if (channelId) {
      dispatch(fetchMessagesForChannel(channelId))
    }
  }, [channelId])

  function sendMessage(content: string, senderId: number) {
    if (!channelId) return
    const message: Message = {
      id: Date.now(),
      channelId,
      content,
      senderId
    }
    dispatch(addMessage({ channelId, message })) // optimistic update
    socketGateway.sendMessage({ channelId, content })
  }

  return { messages, sendMessage }
}

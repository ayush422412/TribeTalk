// useMessage.ts
import { socketGateway } from "../gateway/socket"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"

export function useMessage() {
  const activeChannelId = useSelector(
    (s: RootState) => s.channel.activeChannelId
  )

  function sendMessage(content: string) {
    if (!activeChannelId) return

    socketGateway.sendMessage({
      channelId: activeChannelId,
      content
    })
  }

  return { sendMessage }
}

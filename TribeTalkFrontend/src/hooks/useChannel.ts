import { useDispatch, useSelector } from "react-redux"
import { setActiveChannel } from "../stores/channel.slice"
import { socketGateway } from "../gateway/socket"
// import { RootState } from "../app/store"
import type { RootState } from "../app/store";

export function useChannel(serverId: number | null) {
  const dispatch = useDispatch()
  const channels =
    useSelector(
      (s: RootState) =>
        serverId ? s.channel.channelsByServer[serverId] : []
    ) || []

  return {
    channels,
    selectChannel(channelId: number) {
      dispatch(setActiveChannel(channelId))
      socketGateway.joinChannel(channelId)
    }
  }
}

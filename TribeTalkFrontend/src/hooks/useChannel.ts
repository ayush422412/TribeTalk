// hooks/useChannel.ts (FIXED)
import { useDispatch } from "react-redux"
import { setActiveChannel } from "../features/channels/channel.slice"
import { useGetServerByIdQuery } from "../features/servers/server.api"
import { socketGateway } from "../gateway/socket"
import React from "react"

export function useChannel(serverId: string | null) {
  const dispatch = useDispatch()

  const { data: server, isLoading, refetch } = useGetServerByIdQuery(serverId ?? "", {
    skip: !serverId
  })

  const channels = React.useMemo(() => server?.channels ?? [], [server?.channels])

  const selectChannel = (channelId: string) => {
    dispatch(setActiveChannel(channelId))
    socketGateway.joinChannel(channelId)  // FIXED: now receives string
  }

  // FIXED: Added refetchChannels function
  const refetchChannels = React.useCallback(() => {
    if (serverId) {
      refetch()
    }
  }, [serverId, refetch])

  return {
    channels,
    selectChannel,
    isLoading,
    refetchChannels  // FIXED: Now exposed
  }
}
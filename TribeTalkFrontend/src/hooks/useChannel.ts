// hooks/useChannel.ts (FIXED)
import { useDispatch } from "react-redux"
import { setActiveChannel, setUnreadCount } from "../features/channels/channel.slice"
import { useGetServerByIdQuery } from "../features/servers/server.api"
import { socketGateway } from "../gateway/socket"
import React, { useEffect } from "react"



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
 useEffect(() => {
  if (!serverId) return;

  const handleUnreadCounts = (data: { [channelId: string]: number }) => {
    dispatch(setUnreadCount(data))
  }

  socketGateway.onUnreadCounts(handleUnreadCounts)

  // ask backend for counts WHEN server changes
  socketGateway.getUnreadCounts()

  return () => {
    socketGateway.offUnreadCounts(handleUnreadCounts)
  }
}, [dispatch, serverId])


  return {
    channels,
    selectChannel,
    isLoading,
    refetchChannels  // FIXED: Now exposed
  }
}
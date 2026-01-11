import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useMessages } from "./useMessages"; // import your messages hook

export function useRightContent() {
  // Get active server
  const activeServer = useSelector(
    (state: RootState) =>
      state.server.servers.find(s => s.id === state.server.activeServerId) || null
  );

  // Get active channel
  const activeChannel = useSelector(
    (state: RootState) =>
      activeServer
        ? state.channel.channelsByServer[activeServer.id]?.find(
            c => c.id === state.channel.activeChannelId
          ) || null
        : null
  );

  // Use messages hook for the active channel
  const { messages, sendMessage } = useMessages(activeChannel?.id || null);

  return {
    activeServer,
    activeChannel,
    messages,
    sendMessage
  };
}

// LeftSidebar.tsx
import { useState } from "react"
import { useServer } from "../hooks/useServer"
import { useChannel } from "../hooks/useChannel"
import CreateServerModal from "./CreateServerModal"
import CreateChannelModal from "./CreateChannelModal"

const LeftSidebar = () => {
  const { servers, activeServerId, selectServer, isLoading: serversLoading } = useServer()
  const { channels, selectChannel, isLoading: channelsLoading, refetchChannels } = useChannel(activeServerId)
  const [isServerModalOpen, setIsServerModalOpen] = useState(false)
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false)

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-6">My App</h1>

      {/* 🔹 Servers */}
      <div className="mb-6">
        {serversLoading && <p className="text-sm text-gray-400">Loading servers...</p>}

        {servers.map((server) => (
          <button
            key={server._id}
            onClick={() => selectServer(server._id)}
            className={`block w-full text-left p-2 rounded ${
              activeServerId === server._id ? "bg-gray-700" : ""
            }`}
          >
            {server.name}
          </button>
        ))}

        <button
          onClick={() => setIsServerModalOpen(true)}
          className="mt-2 w-full p-2 bg-green-600 rounded hover:bg-green-500"
        >
          + Create Server
        </button>
      </div>

      {/* 🔹 Channels */}
      <div>
        {channelsLoading ? (
          <p className="text-sm text-gray-400">Loading channels...</p>
        ) : (
          channels.map((channel) => (
            <button
              key={channel._id}
              onClick={() => selectChannel(channel._id)}
              className="block w-full text-left p-2 hover:bg-gray-700"
            >
              #{channel.name}
            </button>
          ))
        )}

        {/* Create Channel Button */}
        {activeServerId && (
          <button
            onClick={() => setIsChannelModalOpen(true)}
            className="mt-2 w-full p-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            + Create Channel
          </button>
        )}
      </div>

      <CreateServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />
      <CreateChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        serverId={activeServerId!} // guaranteed to exist
        onChannelCreated={() => refetchChannels?.()} // refresh channels after creation
      />
    </div>
  )
}

export default LeftSidebar

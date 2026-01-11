import { useServer } from "../hooks/useServer"
import { useChannel } from "../hooks/useChannel"

const LeftSidebar = () => {
  const { servers, activeServerId, selectServer } = useServer()
  const { channels, selectChannel } = useChannel(activeServerId)

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-6">My App</h1>

      <div className="mb-6">
        {servers.map(server => (
          <button
            key={server.id}
            onClick={() => selectServer(server.id)}
            className={`block w-full text-left p-2 rounded ${
              activeServerId === server.id ? "bg-gray-700" : ""
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      <div>
        {channels.map(channel => (
          <button
            key={channel.id}
            onClick={() => selectChannel(channel.id)}
            className="block w-full text-left p-2 hover:bg-gray-700"
          >
            #{channel.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar

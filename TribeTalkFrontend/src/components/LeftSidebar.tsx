import React, { useState } from "react";
import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { changeserver } from "../features/server/Server";

interface Channel {
  id: number;
  name: string;
}

interface Server {
  id: number;
  name: string;
  channels: Channel[];
}

const LeftSidebar = () => {
  const [servers] = useState<Server[]>([
    {
      id: 1,
      name: "Server 1",
      channels: [
        { id: 1, name: "general" },
        { id: 2, name: "random" },
      ],
    },
    {
      id: 2,
      name: "Server 2",
      channels: [
        { id: 3, name: "announcements" },
        { id: 4, name: "gaming" },
      ],
    },
    {
      id: 3,
      name: "Server 3",
      channels: [
        { id: 5, name: "chat" },
        { id: 6, name: "projects" },
      ],
    },
  ]);

  // ✅ Read active server from Redux
  const activeServer = useSelector(
    (state: RootState) => state.server
  );

  const dispatch = useDispatch();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">My App</h1>

      {/* Servers list */}
      <div className="flex flex-col gap-2 mb-6">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => dispatch(changeserver(server))}
            className={`p-2 rounded text-left hover:bg-gray-700 ${
              activeServer === server ? "bg-gray-700" : ""
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      {/* Channels of active server */}
      {/* {activeServer && (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-gray-300">Channels</h2>
          {servers
            .find((s) => s === activeServer)!
            .channels.map((channel) => (
              <a
                key={channel.id}
                href="#"
                className="hover:bg-gray-700 p-2 rounded"
              >
                #{channel.name}
              </a>
            ))}
        </div>
      )} */}
    </div>
  );
};

export default LeftSidebar;

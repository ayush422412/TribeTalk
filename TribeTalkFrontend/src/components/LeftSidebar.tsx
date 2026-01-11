import React, { useState } from "react";
import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { changeserver } from "../features/server/Server";
import { changeChannel } from "../features/channel/Channel";
// interface User {
//   id: number;
//   name: string;
// }
interface Channel {
  id: number;
  name: string;
  description : string;
  members :string[];
}


interface Server {
  id: number;
  name: string;
  channels: Channel[];
}

const LeftSidebar = () => {
  const [servers] = useState<Server[]>([
    {
      id: 0,
      name: "Server 1",
      channels: [
        { id: 1, name: "general", description: "General discussion" , members : []},
        { id: 2, name: "random", description: "Random conversations" , members : []},
      ],
    },
    {
      id: 2,
      name: "Server 2",
      channels: [
        { id: 3, name: "announcements", description: "Official announcements", members : [] },
        { id: 4, name: "gaming", description: "Gaming discussions", members : [] },
      ],
    },
    {
      id: 3,
      name: "Server 3",
      channels: [
        { id: 5, name: "chat", description: "Chat discussions", members : [] },
        { id: 6, name: "projects", description: "Project discussions", members : [] },
      ],
    },
  ]);

  // ✅ Read active server from Redux
  const activeServer = useSelector(
    (state: RootState) => state.server
  );
  const activechannel=useSelector(
    (state: RootState) => state.channel
  );

  const dispatch = useDispatch();
  console.log(activeServer);
  servers
      .find((s) => s.id === activeServer.id)!
      .channels.map((channel) => (
       console.log(channel)
      )) 
  

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
      

   {activeServer && (
  <div className="flex flex-col gap-2" >
    <h2 className="font-semibold text-gray-300">Channels</h2>
    {servers
      .find((s) => s.id === activeServer.id)!
      .channels.map((channel) => (
        <a
          key={channel.id}
          onClick={() => dispatch(changeChannel(channel))}
          href="#"
          className="hover:bg-gray-700 p-2 rounded"
        >
          {channel.name}
        </a>
      ))}
  </div>
)}

    </div>
  );
};

export default LeftSidebar;

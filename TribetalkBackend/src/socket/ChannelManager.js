import { currentServer } from "../Service/Server.service.js";
import { userCanJoin } from "../Service/Channel.service.js";



export default class ChannelManager {
  constructor(io, sessionManager) {
    this.io = io;
    this.sessionManager = sessionManager;
  }
  async joinChannel(socket, channelId) {
    const serverId = await currentServer();
  
    const canJoin = await userCanJoin({
      userId: socket.user._id,
      serverId,
      channelId,
    });

    if (!canJoin) {
      throw new Error("User not allowed to join this channel");
    }

    
    socket.join(`channel:${channelId}`);
    socket.channelId = channelId;

   
    socket.emit("channelJoined", {
      channelId,
    });
  }

  // 🚫 PREVENT MULTIPLE CHANNELS
  //   if (socket.channelId) {
  //     socket.leave(`channel:${socket.channelId}`);
  //   }

  //   socket.join(`channel:${channelId}`);
  //   socket.channelId = channelId;

  //   socket.emit("channelJoined", { channelId });
  // }

  leaveActiveChannel(socket, channelId) {
    socket.leave(`channel:${channelId}`);

    if (socket.channelId === channelId) {
      socket.channelId = null;
    }
  }
}






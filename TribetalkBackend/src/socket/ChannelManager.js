export default class ChannelManager {
  constructor() {

  }

  joinActiveChannel(socket, channelId) {
    socket.join(channelId);
    socket.to(channelId).broadcast("userJoined", {
      socketId: socket.id,
    });
  }
  

  leaveActiveChannel(socket, channelId) {
    socket.leave(channelId);
    socket.to(channelId).broadcast("userLeft", {
      socketId: socket.id,
    });
  }
}
 
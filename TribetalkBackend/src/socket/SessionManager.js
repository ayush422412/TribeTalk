export default class SessionManager {
  constructor() {
    this.userToSocket = new Map();
    this.socketToUser = new Map();
  }

  addUser(userId, socketId) {
    if (!this.userToSocket.has(userId)) {
      this.userToSocket.set(userId, new Set());
    }

    this.userToSocket.get(userId).add(socketId);
    this.socketToUser.set(socketId, userId);
  }

  removeSocket(socketId) {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return;

    const socketSet = this.userToSocket.get(userId);
    socketSet?.delete(socketId);

    if (socketSet?.size === 0) {
      this.userToSocket.delete(userId);
    }

    this.socketToUser.delete(socketId);
  }

  removeUser(userId) {
    const socketSet = this.userToSocket.get(userId);
    if (!socketSet) return;

    for (const socketId of socketSet) {
      this.socketToUser.delete(socketId);
    }

    this.userToSocket.delete(userId);
  }
}

export default class SessionManager {
  constructor() {
    this.userToSocket = new Map();
    this.socketToUser = new Map();
  }

  // addUser(userId, socketId) {
  //   this.userToSocket.set(userId, socketId);
  //   this.socketToUser.set(socketId, userId);
  // }

  addUser(userId, socketId) {
    console.log(userId,socketId)
    if (!this.userToSocket.has(userId)) {
      this.userToSocket.set(userId, new Set());
    }

    this.userToSocket.get(userId).add(socketId);
    this.socketToUser.set(socketId, userId);
  }

  removeSocket(socketId) {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return;

    this.userToSocket.get(userId)?.delete(socketId);
    if (this.userToSocket.get(userId)?.size === 0) {
      this.userToSocket.delete(userId);
    }

    this.socketToUser.delete(socketId);
  }



}

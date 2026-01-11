export default class SessionManager {
  constructor() {
    this.userToSocket = new Map();
    this.socketToUser = new Map();
  }

  addUser(userId, socketId) {
    this.userToSocket.set(userId, socketId);
    this.socketToUser.set(socketId, userId);
  }


}

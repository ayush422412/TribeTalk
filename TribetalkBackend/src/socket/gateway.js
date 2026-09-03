import SessionManager from "./SessionManager.js";
import ChannelManager from "./ChannelManager.js";
import { socketAuthMiddleware, channelGuardMiddleware } from "./socket.middleware.js";

import registerChannelHandlers from "./handlers/channel.handler.js";
import registerMessageHandlers from "./handlers/message.handler.js";
import registerSyncHandlers from "./handlers/sync.handler.js";

const typingUsers = new Map(); // channelId -> Set of userIds

export default function setupGateway(io) {
    const sessionManager = new SessionManager();
    const channelManager = new ChannelManager(io, sessionManager);

    // 1. Handshake authentication
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id} | User: ${socket.user._id}`);
        sessionManager.addUser(socket.user._id.toString(), socket.id);

        // 2. Event-level packet middleware & central errors
        socket.use(channelGuardMiddleware(socket));
        socket.on("error", (err) => {
            socket.emit("error", { message: err.message });
        });

        // 3. Mount handlers
        registerChannelHandlers(io, socket, typingUsers);
        registerMessageHandlers(io, socket);
        registerSyncHandlers(io, socket);

        // 4. Socket teardown
        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id} | User: ${socket.user._id}`);

            for (const [channelId, users] of typingUsers.entries()) {
                if (users.delete(socket.user._id.toString())) {
                    io.to(channelId).emit("user_typing_stop", {
                        channelId,
                        userId: socket.user._id.toString()
                    });
                }
            }
            sessionManager.removeSocket(socket.id);
            // sessionManager.removeUser(socket.user._id.toString());
        });
    });
}
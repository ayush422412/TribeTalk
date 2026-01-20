// gateway.js (COMPLETE with cursor-based messaging)
import SessionManager from "./SessionManager.js";
import ChannelManager from "./ChannelManager.js";
import { getUserFromToken } from "../Middlewares/Auth.middleware.js";
import * as messageService from "../Service/Message.service.js";

// Store for typing indicators (in-memory)
const typingUsers = new Map(); // channelId -> Set of userIds

export default function setupGateway(io) {
    const sessionManager = new SessionManager();
    const channelManager = new ChannelManager(io, sessionManager);

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            // Try frontend (socket.io client) auth
            let token = socket.handshake.auth?.token;

            // Try Postman/manual testing auth
            if (!token) {
                const authHeader = socket.handshake.headers?.authorization;
                if (authHeader?.startsWith("Bearer ")) {
                    token = authHeader.split(" ")[1];
                }
            }

            if (!token) {
                return next(new Error("Authentication token missing"));
            }

            const user = await getUserFromToken(token);
            if (!user) {
                return next(new Error("Invalid token"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id} | User: ${socket.user._id}`);

        // Register user session
        sessionManager.addUser(socket.user._id.toString(), socket.id);

        // ============================================
        // CHANNEL JOIN/LEAVE
        // ============================================

        /**
         * Join a channel room and receive sync data
         * 
         * Client sends:
         * {
         *   channelId: string,
         *   lastKnownSequence?: number  // For reconnect/resume
         * }
         * 
         * Server responds with:
         * - sync_state event with latest message info
         * - missed_messages event if client was offline
         */
        socket.on("join_channel", async ({ channelId, lastKnownSequence = 0 }) => {
            try {
                console.log(`📥 join_channel: User ${socket.user._id} joining ${channelId}`);

                // TODO: Validate user has access to this channel
                // const hasAccess = await checkChannelAccess(socket.user._id, channelId);
                // if (!hasAccess) {
                //     socket.emit("error", { message: "Access denied to this channel" });
                //     return;
                // }

                // Join the socket.io room
                socket.join(channelId);

                // Get sync data (latest message + unread count)

                const syncData = await messageService.getChannelSyncData(
                    socket.user._id,
                    channelId
                );

                console.log(`📤 Sending sync_state:`, syncData);

                // Send sync state to client
                socket.emit("sync_state", {
                    channelId,
                    latestMessageId: syncData.latestMessageId,
                    latestSequence: syncData.latestSequence,
                    unreadCount: syncData.unreadCount,
                    lastReadSequence: syncData.lastReadSequence
                });

                console.log("current sequrce", lastKnownSequence, channelId)

                // If client was offline and missed messages, send them
                if (lastKnownSequence > 0 && lastKnownSequence < syncData.latestSequence) {
                    const missedMessages = await messageService.getMissedMessages(
                        channelId,
                        lastKnownSequence
                    );

                    console.log(`📤 Sending ${missedMessages.length} missed messages`);

                    socket.emit("missed_messages", {
                        channelId,
                        messages: missedMessages.map(msg => formatMessageDTO(msg))
                    });
                }

            } catch (error) {
                console.error("❌ Error in join_channel:", error);
                socket.emit("error", { message: "Failed to join channel" });
            }
        });

        /**
         * Leave a channel room
         */
        socket.on("leave_channel", ({ channelId }) => {
            console.log(`📤 leave_channel: User ${socket.user._id} leaving ${channelId}`);
            socket.leave(channelId);

            // Clean up typing indicator
            if (typingUsers.has(channelId)) {
                typingUsers.get(channelId).delete(socket.user._id.toString());
            }
        });

        // ============================================
        // MESSAGING
        // ============================================

        /**
         * Send a message
         * 
         * Client sends:
         * {
         *   channelId: string,
         *   content: string,
         *   clientId?: string  // For optimistic updates
         * }
         */
        socket.on("send_message", async ({ channelId, content, clientId = null }) => {
            try {
                const user = socket.user; // ✅ FULL USER OBJECT

                console.log(`📨 send_message: ${user._id} -> ${channelId}, clientId: ${clientId}`);


                // Save message
                const savedMessage = await messageService.addMessage({
                    content,
                    channelId,
                    UserId: user._id,
                    clientId
                });

                console.log(`✅ Message saved: seq=${savedMessage.sequence}, id=${savedMessage._id}`);

                // 🔥 CRITICAL FIX: attach user BEFORE DTO
                const messageWithUser = {
                    ...savedMessage.toObject(),
                    user: {
                        _id: user._id,
                        username: user.username
                    }
                };

                const messageDTO = formatMessageDTO(messageWithUser);
                console.log(`📋 MessageDTO:`, messageDTO);

                // Echo to sender WITH clientId
                socket.emit("new_message", messageDTO);
                console.log(`📤 Sent echo to sender (${socket.id}) WITH clientId: ${clientId}`);

                // Broadcast to others WITHOUT clientId
                socket.to(channelId).emit("new_message", {
                    ...messageDTO,
                    clientId: null
                });

                console.log(`📢 Broadcasted to others in room ${channelId}`);

            } catch (error) {
                console.error("❌ Error in send_message:", error);
                socket.emit("error", {
                    message: "Failed to send message",
                    clientId
                });
            }
        });


        /**
         * Edit a message
         * 
         * Client sends:
         * {
         *   messageId: string,
         *   content: string
         * }
         */
        socket.on("edit_message", async ({ messageId, content }) => {
            try {
                const userId = socket.user._id;

                console.log(`✏️ edit_message: ${messageId} by ${userId}`);

                const updatedMessage = await messageService.editMessage(
                    messageId,
                    content,
                    userId
                );

                const messageDTO = formatMessageDTO(updatedMessage);

                // Broadcast to all users in the channel
                io.to(updatedMessage.channel.toString()).emit("message_updated", messageDTO);

                console.log(`📢 Broadcasted message_updated: ${messageId}`);

            } catch (error) {
                console.error("❌ Error in edit_message:", error);
                socket.emit("error", { message: error.message || "Failed to edit message" });
            }
        });

        /**
         * Delete a message
         * 
         * Client sends:
         * {
         *   messageId: string
         * }
         */
        socket.on("delete_message", async ({ messageId }) => {
            try {
                const userId = socket.user._id;

                console.log(`🗑️ delete_message: ${messageId} by ${userId}`);

                const deletedMessage = await messageService.deleteMessage(messageId, userId);

                const messageDTO = formatMessageDTO(deletedMessage);

                // Broadcast to all users in the channel
                io.to(deletedMessage.channel.toString()).emit("message_deleted", {
                    channelId: deletedMessage.channel.toString(),
                    messageId: deletedMessage._id.toString(),
                    message: messageDTO
                });

                console.log(`📢 Broadcasted message_deleted: ${messageId}`);

            } catch (error) {
                console.error("❌ Error in delete_message:", error);
                socket.emit("error", { message: error.message || "Failed to delete message" });
            }
        });



        // ============================================
        // TYPING INDICATORS
        // ============================================

        /**
         * User started typing
         * 
         * Client sends:
         * {
         *   channelId: string
         * }
         */
        socket.on("typing_start", ({ channelId }) => {
            if (!typingUsers.has(channelId)) {
                typingUsers.set(channelId, new Set());
            }

            typingUsers.get(channelId).add(socket.user._id.toString());

            // Broadcast to others in channel (NOT including sender)
            socket.to(channelId).emit("user_typing", {
                channelId,
                userId: socket.user._id.toString(),
                username: socket.user.username
            });

            console.log(`⌨️ typing_start: ${socket.user.username} in ${channelId}`);
        });

        /**
         * User stopped typing
         */
        socket.on("typing_stop", ({ channelId }) => {
            if (typingUsers.has(channelId)) {
                typingUsers.get(channelId).delete(socket.user._id.toString());
            }

            socket.to(channelId).emit("user_typing_stop", {
                channelId,
                userId: socket.user._id.toString()
            });

            console.log(`⌨️ typing_stop: ${socket.user.username} in ${channelId}`);
        });



        // ============================================
        // MESSAGING
        // ============================================

        /**
         * Send a message
         * 
         * Client sends:
         * {
         *   channelId: string,
         *   content: string,
         *   clientId?: string  // For optimistic updates
         * }
         */
        socket.on("get_unread_counts",async() => {
            const unread_counts=await messageService.getUnreadCountsForUser(socket.user._id)
            console.log( "unreadcounts",unread_counts)
            socket.emit("unread_counts",unread_counts)
            

          
        }
        )





        // ============================================
        // READ RECEIPTS
        // ============================================

        /**
         * Mark channel as read
         * 
         * Client sends:
         * {
         *   channelId: string,
         *   lastReadMessageId?: string
         * }
         */
        socket.on("mark_read", async ({ channelId, lastReadMessageId }) => {
            try {
                await messageService.markAsRead(
                    socket.user._id,
                    channelId,
                    lastReadMessageId
                );

                console.log(`✅ mark_read: ${socket.user._id} in ${channelId}`);

                // Optionally broadcast read receipt to others
                // socket.to(channelId).emit("user_read", {
                //     channelId,
                //     userId: socket.user._id.toString(),
                //     lastReadMessageId
                // });

            } catch (error) {
                console.error("❌ Error in mark_read:", error);
            }
        });

        // ============================================
        // RECONNECT/SYNC
        // ============================================

        /**
         * Request sync after reconnect
         * 
         * Client sends:
         * {
         *   channelId: string,
         *   lastReceivedSequence: number
         * }
         */
        socket.on("request_sync", async ({ channelId, lastReceivedSequence }) => {
            try {
                console.log(`🔄 request_sync: ${channelId} from seq ${lastReceivedSequence}`);

                const missedMessages = await messageService.getMissedMessages(
                    channelId,
                    lastReceivedSequence
                );

                socket.emit("sync_messages", {
                    channelId,
                    messages: missedMessages.map(msg => formatMessageDTO(msg))
                });

                console.log(`📤 Sent ${missedMessages.length} sync messages`);

            } catch (error) {
                console.error("❌ Error in request_sync:", error);
                socket.emit("error", { message: "Failed to sync messages" });
            }
        });

        // ============================================
        // DISCONNECT
        // ============================================

        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id} | User: ${socket.user._id}`);

            // Clean up typing indicators
            for (const [channelId, users] of typingUsers.entries()) {
                if (users.has(socket.user._id.toString())) {
                    users.delete(socket.user._id.toString());
                    io.to(channelId).emit("user_typing_stop", {
                        channelId,
                        userId: socket.user._id.toString()
                    });
                }
            }

            sessionManager.removeUser(socket.user._id.toString());
        });
    });
}




// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format message for client transmission
 */
function formatMessageDTO(message) {
    // Normalize sender (works for realtime + DB + fallback)
    const sender =
        message.user ||          // realtime (socket.user)
        message.UserId ||        // populated DB
        null;

    return {
        id: message._id.toString(),
        content: message.content,

        senderId:
            sender?._id?.toString() ||
            (typeof sender === "string" ? sender : null),

        senderUsername:
            sender?.username || null,

        senderAvatar:
            sender?.avatar || null,

        channelId:
            message.channelId?.toString?.() ||
            message.channel?.toString(),

        sequence: message.sequence,
        timestamp: message.createdAt.toISOString(),
        isEdited: message.isEdited || false,
        editedAt: message.editedAt?.toISOString() || null,
        isSystemMessage: message.isSystemMessage || false,
        clientId: message.clientId || null
    };
}

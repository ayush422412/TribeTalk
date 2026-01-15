import SessionManager from "./SessionManager.js";
import ChannelManager from "./ChannelManager.js";
import { addMessage } from "../Service/Message.service.js";

import { getUserFromToken } from "../Middlewares/Auth.middleware.js"





export default function setupGateway(io) {
    const sessionManager = new SessionManager();
    const channelManager = new ChannelManager(io, sessionManager);

    // io.use(async (socket, next) => {
    //     const token = socket.handshake.auth.token;
    //     if (!token) return next(new Error("Authentication error"));

    //     try {
    //         const user = await getUserFromToken(token); // use your function
    //         if (!user) return next(new Error("Invalid token"));

    //         socket.user = user; // attach the user to the socket
    //         next(); // allow the connection
    //     } catch (err) {
    //         next(new Error("Authentication error"));
    //     }
    // });


    // for postmen testing
    io.use(async (socket, next) => {
        try {
            // 1️⃣ Frontend (socket.io client)
            let token = socket.handshake.auth?.token;

            // 2️⃣ Postman (Socket.IO)
            if (!token) {
                console.log("failed", socket.handshake.headers)
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
        console.log("Socket connected:", socket.id);

        // socket.on("register", ({ UserId }) => {
        //     console.log("registered", "asdfasdf")
        //     sessionManager.addUser(UserId, socket.id);
        // });
        console.log(socket.user)
        sessionManager.addUser(socket.user._id.toString(), socket.id);



        // Add Message to the database.
        socket.on("send_message", async ({ channelId, content }) => {
            const UserId = socket.user._id;

            console.log("message received on server:", { channelId, content, UserId });

            const savedMessage = await addMessage({ content, channelId, UserId });

            console.log("saved message:", savedMessage);

            const messageDTO = {
                id: savedMessage._id.toString(),
                content: savedMessage.content,
                senderId: savedMessage.sender.toString(),
                channelId: savedMessage.channel.toString(),
                timestamp: savedMessage.createdAt.toISOString()
            };
            console.log("emitting to channel:", channelId, "message:", messageDTO);
            // socket.to(`${channelId}`).emit("new_message", messageDTO);
            io.to(`${channelId}`).emit("new_message", messageDTO);

        });


        // Join a channel(room, room hopping, socket joining, 
        // not to be confused with joining a channel in discord.)
        socket.on("join_channel", async ({ channelId }) => {
            console.log("channel id", channelId)
            socket.join(`${channelId}`)
        })

        socket.on("leaveChannel", ({ channelId }) => {
            channelManager.leaveActiveChannel(socket, channelId);
        });








    });
}
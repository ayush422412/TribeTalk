import SessionManager from "./SessionManager.js";
import ChannelManager from "./ChannelManager.js";
import { addMessage } from "../Service/Message.service.js";


export default function setupGateway(io) {
    const sessionManager = new SessionManager();
    const channelManager = new ChannelManager(io, sessionManager);

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("register", ({ UserId }) => {
            console.log("registered", "asdfasdf")
            sessionManager.addUser(UserId, socket.id);
        });


        // Add Message to the database.
        socket.on("addMessage", async ({ channelId, message, UserId }) => {
            
            const savedMessage = await addMessage({ message, UserId, channelId });
            // socket.to(channelId).broadcast("newMessage", savedMessage.content);

        });

        
        // Join a channel(room, room hopping, socket joining, 
        // not to be confused with joining a channel in discord.)
        socket.on("joinChannel", ({ channelId }) => {
            console.log("channel id",channelId)
            // channelManager.joinActiveChannel(socket, channelId);
        });

        socket.on("leaveChannel", ({ channelId }) => {
            channelManager.leaveActiveChannel(socket, channelId);
        });




    });
}

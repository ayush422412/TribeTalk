import SessionManager from "./SessionManager.js";
import ChannelManager from "./ChannelManager.js";
import { addMessage } from "../Service/Message.service.js";


export default function setupGateway(io) {
    const sessionManager = new SessionManager();
    const channelManager = new ChannelManager(io, sessionManager);

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("register", ({ UserId }) => {
            sessionManager.addUser(UserId, socket.id);
        });



        socket.on("addMessage", async ({ channelId, message, UserId }) => {

            const savedMessage = await addMessage({ message, UserId, channelId });

            socket.to(channelId).broadcast("newMessage", savedMessage.content);


        });

        socket.on("joinChannel", ({ socket, channelId }) => {
            channelManager.joinActiveChannel(socket, channelId);
        });

        socket.on("leaveChannel", ({ socket, channelId }) => {
            channelManager.leaveActiveChannel(socket, channelId);
        });




    });
}

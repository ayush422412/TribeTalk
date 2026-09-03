// src/socket/PermissionService.js (or src/Service/Channel.service.js)
import { Channel } from "../Models/Channel.model.js";
import { Server } from "../Models/Server.model.js";

export async function checkChannelAccess(userId, channelId) {
    try {
        if (!userId || !channelId) return false;

        // 1. Fetch channel and its parent server ID
        const channel = await Channel.findById(channelId).select("server").lean();
        if (!channel || !channel.server) return false;

        // 2. Check if user is the owner, a moderator, or a member of the server
        const hasAccess = await Server.exists({
            _id: channel.server,
            $or: [
                { owner: userId },
                { moderators: userId },
                { members: userId }
            ]
        });
        console.log("user has access to this channel")
        return Boolean(hasAccess);
    } catch (error) {
        console.error("❌ Error checking channel access:", error);
        return false;
    }
}
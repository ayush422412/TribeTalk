import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Server } from "../Models/Server.model.js";
import { User } from "../Models/User.model.js";
import mongoose from "mongoose";
import { Channel } from "../Models/Channel.model.js";


const createServer = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const ownerId = req.user._id;

    if (!name || name.trim().length < 3) {
        throw new ApiError(400, "Server name must be at least 3 characters long");
    }

    // Optional: check if user already has a server with same name
    const existingServer = await Server.findOne({ name: name.trim(), owner: ownerId });
    if (existingServer) {
        throw new ApiError(409, "You already have a server with this name");
    }

    const server = await Server.create({
        name: name.trim(),
        description: description?.trim() || "",
        owner: ownerId,
        moderators: [ownerId], // Owner is also a moderator
        members: [ownerId],
    });

    return res.status(201).json(new ApiResponse(201, server, "Server created successfully"));
});



const deleteServer = asyncHandler(async (req, res) => {
    const serverId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    const server = await Server.findById(serverId);
    if (!server) {
        throw new ApiError(404, "Server not found");
    }

    // Only owner can delete the server
    if (server.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this server");
    }

    await server.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Server deleted successfully"));
});



const listServers = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find servers where user is owner, moderator, or member
    const servers = await Server.find({
        $or: [
            { owner: userId },
            { moderators: userId },
            { members: userId }
        ]
    }).select("name _id description owner moderators members") // include arrays for role checking
        .sort({ createdAt: -1 });

    // Map servers and assign role
    const serversWithRole = servers.map(server => {
        let role = "member"; // default

        if (server.owner.toString() === userId.toString()) {
            role = "owner";
        } else if (server.moderators.includes(userId)) {
            role = "moderator";
        }

        return {
            _id: server._id,
            name: server.name,
            description: server.description,
            role
        };
    });

    return res.status(200).json(new ApiResponse(200, serversWithRole, "Servers fetched successfully"));
});



const editServer = asyncHandler(async (req, res) => {
    const serverId = req.params.id;
    const { name, description } = req.body; // both optional
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    const server = await Server.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    // Only owner can edit
    if (server.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the owner can edit the server");
    }

    // Validate name if provided
    if (name && name.trim().length < 3) {
        throw new ApiError(400, "Server name must be at least 3 characters long");
    }

    // Optional: check for duplicate server name for the same owner
    if (name) {
        const existingServer = await Server.findOne({ name: name.trim(), owner: userId });
        if (existingServer && existingServer._id.toString() !== serverId) {
            throw new ApiError(409, "You already have a server with this name");
        }
        server.name = name.trim();
    }

    // Update description if provided
    if (description !== undefined) {
        server.description = description.trim();
    }

    await server.save();

    return res.status(200).json(new ApiResponse(200, {
        _id: server._id,
        name: server.name,
        description: server.description
    }, "Server updated successfully"));
});



const getServerInfo = asyncHandler(async (req, res) => {
    const serverId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    // Fetch server and users
    const server = await Server.findById(serverId)
        .populate("owner", "username")
        .populate("moderators", "username")
        .populate("members", "username");

    if (!server) throw new ApiError(404, "Server not found");

    // Check if user is part of the server
    const isMember = server.members.some(member => member._id.toString() === userId.toString());
    const isModerator = server.moderators.some(mod => mod._id.toString() === userId.toString());
    const isOwner = server.owner._id.toString() === userId.toString();

    if (!isMember && !isModerator && !isOwner) {
        throw new ApiError(403, "You are not part of this server");
    }

    // Fetch channels for this server
    const channels = await Channel.find({ server: serverId })
        .select("_id name type description")
        .sort({ createdAt: 1 }); // oldest first

    return res.status(200).json(new ApiResponse(200, {
        _id: server._id,
        name: server.name,
        description: server.description,
        owner: server.owner.username,
        moderators: server.moderators.map(m => m.username),
        members: server.members.map(m => m.username),
        channels // include channels array
    }, "Server info fetched successfully"));
});



const joinServer = asyncHandler(async (req, res) => {
    const serverId = req.params.id; // <-- now in the URL
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    const server = await Server.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    // Check if user is already in server
    if (
        server.owner.toString() === userId.toString() ||
        server.moderators.includes(userId) ||
        server.members.includes(userId)
    ) {
        throw new ApiError(400, "You are already part of this server");
    }

    // Add user as member
    server.members.push(userId);
    await server.save();

    return res.status(200).json(new ApiResponse(200, {
        _id: server._id,
        name: server.name
    }, "Joined server successfully"));
});


export {
    createServer,
    deleteServer,
    listServers,
    editServer,
    getServerInfo,
    joinServer
}
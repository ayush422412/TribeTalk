import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Channel } from "../Models/Channel.model.js";
import { Server } from "../Models/Server.model.js";
import mongoose from "mongoose";


const createChannel = asyncHandler(async (req, res) => {
    const { name, serverId, description } = req.body;
    const userId = req.user._id;

    // Validation
    if (!name || name.trim().length < 2) {
        throw new ApiError(400, "Channel name must be at least 2 characters long");
    }

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    // Find server
    const server = await Server.findById(serverId);
    if (!server) {
        throw new ApiError(404, "Server not found");
    }

    // Check if user is server owner or a moderator
    const isAdminOrModerator =
        server.owner.toString() === userId.toString() ||
        (server.moderators || []).some(modId => modId.toString() === userId.toString());

    if (!isAdminOrModerator) {
        throw new ApiError(403, "Only the server owner or moderators can create channels");
    }

    // Only allow text channels for MVP
    const type = "text";

    const channel = await Channel.create({
        name: name.trim().toLowerCase(),
        server: serverId,
        createdBy: userId,
        type,
        description: description?.trim() || "",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, channel, "Channel created successfully"));
});


const deleteChannel = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Populate server to access owner/moderators
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const server = channel.server;

    // Check if user is server owner or a moderator
    const isAdminOrModerator =
        server.owner.toString() === userId.toString() ||
        (server.moderators || []).some(modId => modId.toString() === userId.toString());

    if (!isAdminOrModerator) {
        throw new ApiError(403, "Only the server owner or moderators can delete this channel");
    }

    await channel.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Channel deleted successfully"));
});



const editChannel = asyncHandler(async (req, res) => {
    const channelId = req.params.id; // channel ID in URL param
    const { name, description } = req.body; // optional new name & description
    const userId = req.user._id;

    // Validate channel ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find channel and populate server
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const server = channel.server;

    // Only owner or moderators can edit
    const isAdminOrModerator =
        server.owner.toString() === userId.toString() ||
        (server.moderators || []).some(modId => modId.toString() === userId.toString());

    if (!isAdminOrModerator) {
        throw new ApiError(403, "Only the server owner or moderators can edit this channel");
    }

    // Validate and update name if provided
    if (name) {
        if (name.trim().length < 2) {
            throw new ApiError(400, "Channel name must be at least 2 characters long");
        }

        channel.name = name.trim().toLowerCase();
    }

    // Update description if provided
    if (description !== undefined) {
        channel.description = description.trim();
    }

    await channel.save();

    return res.status(200).json(new ApiResponse(200, {
        _id: channel._id,
        name: channel.name,
        description: channel.description
    }, "Channel updated successfully"));
});


const getChannelInfo = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Fetch channel and populate server
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const server = channel.server;

    // Check if user is a member of the server
    const isMember =
        server.owner.toString() === userId.toString() ||
        (server.moderators || []).some(modId => modId.toString() === userId.toString()) ||
        (server.members || []).some(memberId => memberId.toString() === userId.toString());

    if (!isMember) {
        throw new ApiError(403, "You must be a member of the server to view this channel");
    }

    return res.status(200).json(new ApiResponse(200, channel, "Channel fetched successfully"));
});


export {
    createChannel,
    deleteChannel,
    editChannel,
    getChannelInfo
};  
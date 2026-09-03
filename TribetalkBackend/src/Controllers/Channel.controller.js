import mongoose from "mongoose";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import * as channelService from "../Service/Channel.service.js";

export const createChannel = asyncHandler(async (req, res) => {
    const { name, serverId, description } = req.body;

    if (!name || name.trim().length < 2) {
        throw new ApiError(400, "Channel name must be at least 2 characters long");
    }
    if (!mongoose.Types.ObjectId.isValid(serverId)) {
        throw new ApiError(400, "Invalid server ID");
    }

    const channel = await channelService.createChannel({
        name,
        serverId,
        description,
        userId: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, channel, "Channel created successfully")
    );
});

export const deleteChannel = asyncHandler(async (req, res) => {
    const channelId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    await channelService.deleteChannel({
        channelId,
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Channel deleted successfully")
    );
});

export const editChannel = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    if (name && name.trim().length < 2) {
        throw new ApiError(400, "Channel name must be at least 2 characters long");
    }

    const updatedChannel = await channelService.editChannel({
        channelId,
        name,
        description,
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, updatedChannel, "Channel updated successfully")
    );
});

export const getChannelInfo = asyncHandler(async (req, res) => {
    const channelId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const channel = await channelService.getChannelInfo({
        channelId,
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, channel, "Channel fetched successfully")
    );
});
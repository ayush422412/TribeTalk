import mongoose from "mongoose";
import { checkChannelAccess } from "../Service/Permission.service.js";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

export const verifyChannelAccess = asyncHandler(async (req, res, next) => {
    // 1. Resolve channelId from params (e.g. /:channelId or /:id), body, or query
    const channelId =
        req.params.channelId ||
        req.params.id ||
        req.body?.channelId ||
        req.query?.channelId;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID format");
    }

    // 2. Ensure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    // 3. Verify server membership / ownership
    const hasAccess = await checkChannelAccess(userId, channelId);
    if (!hasAccess) {
        throw new ApiError(403, "You do not have permission to access this channel");
    }

    // 4. Attach channelId to request object for downstream convenience
    req.channelId = channelId;

    next();
});
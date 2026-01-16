// Controllers/Message.controller.js
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import * as messageService from "../Service/Message.service.js";

/**
 * GET /api/v1/channels/:channelId/messages
 * Get message history with cursor-based pagination
 * 
 * Query params:
 * - limit: number of messages (default 50, max 100)
 * - before: messageId to load older messages
 * - after: messageId to load newer messages
 */
export const getMessageHistory = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { limit = 50, before, after } = req.query;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const messages = await messageService.getMessageHistory({
    channelId,
    limit: parseInt(limit),
    before,
    after
  });

  return res.status(200).json(
    new ApiResponse(200, {
      messages,
      hasMore: messages.length === parseInt(limit),
      cursor: messages.length > 0 ? messages[messages.length - 1]._id : null
    }, "Messages retrieved successfully")
  );
});

/**
 * POST /api/v1/channels/:channelId/mark-read
 * Mark messages as read up to a specific message
 * 
 * Body:
 * - lastReadMessageId: ID of the last message read (optional, defaults to latest)
 */
export const markChannelAsRead = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { lastReadMessageId } = req.body;
  const userId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const readState = await messageService.markAsRead(userId, channelId, lastReadMessageId);

  return res.status(200).json(
    new ApiResponse(200, readState, "Channel marked as read")
  );
});

/**
 * GET /api/v1/channels/:channelId/unread-count
 * Get unread message count for a channel
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const unreadCount = await messageService.getUnreadCount(userId, channelId);

  return res.status(200).json(
    new ApiResponse(200, { unreadCount }, "Unread count retrieved")
  );
});

/**
 * GET /api/v1/channels/:channelId/sync
 * Get sync data for a channel (latest message + unread count)
 */
export const getChannelSyncData = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const syncData = await messageService.getChannelSyncData(userId, channelId);

  return res.status(200).json(
    new ApiResponse(200, syncData, "Sync data retrieved")
  );
});

/**
 * PUT /api/v1/messages/:messageId
 * Edit a message
 * 
 * Body:
 * - content: new message content
 */
export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!messageId || !content) {
    throw new ApiError(400, "Message ID and content are required");
  }

  const updatedMessage = await messageService.editMessage(messageId, content, userId);

  return res.status(200).json(
    new ApiResponse(200, updatedMessage, "Message updated successfully")
  );
});

/**
 * DELETE /api/v1/messages/:messageId
 * Delete a message
 */
export const deleteMessageById = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }

  const deletedMessage = await messageService.deleteMessage(messageId, userId);

  return res.status(200).json(
    new ApiResponse(200, deletedMessage, "Message deleted successfully")
  );
});
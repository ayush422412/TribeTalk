// Routes/message.routes.js
import express from "express";
import * as messageController from "../Controllers/Message.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js"; // Your auth middleware

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get message history for a channel (cursor-based pagination)
// GET /api/v1/channels/:channelId/messages?limit=50&before=messageId&after=messageId
router.get("/:channelId/messages", messageController.getMessageHistory);

// Mark channel as read
// POST /api/v1/channels/:channelId/mark-read
router.post("/:channelId/mark-read", messageController.markChannelAsRead);

// Get unread count for a channel
// GET /api/v1/channels/:channelId/unread-count
router.get("/:channelId/unread-count", messageController.getUnreadCount);

// Get sync data for a channel (latest message + unread)
// GET /api/v1/channels/:channelId/sync
router.get("/:channelId/sync", messageController.getChannelSyncData);

// Edit a message
// PUT /api/v1/messages/:messageId
router.put("/messages/:messageId", messageController.editMessage);

// Delete a message
// DELETE /api/v1/messages/:messageId
router.delete("/messages/:messageId", messageController.deleteMessageById);

export default router;
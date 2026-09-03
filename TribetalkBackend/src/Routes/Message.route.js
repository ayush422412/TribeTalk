import express from "express";
import * as messageController from "../Controllers/Message.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
import { verifyChannelAccess } from "../Middlewares/ChannelAccess.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// ============================================
// CHANNEL-SCOPED MESSAGING (Guarded by Channel Access)
// ============================================

// Get message history for a channel (cursor-based pagination)
router.get("/:channelId/messages", verifyChannelAccess, messageController.getMessageHistory);

// Mark channel as read
router.post("/:channelId/mark-read", verifyChannelAccess, messageController.markChannelAsRead);

// Get unread count for a channel
router.get("/:channelId/unread-count", verifyChannelAccess, messageController.getUnreadCount);

// Get sync data for a channel (latest message + unread)
router.get("/:channelId/sync", verifyChannelAccess, messageController.getChannelSyncData);

// ============================================
// INDIVIDUAL MESSAGE OPERATIONS (Ownership checked in Service)
// ============================================

// Edit a message
router.put("/messages/:messageId", messageController.editMessage);

// Delete a message
router.delete("/messages/:messageId", messageController.deleteMessageById);

export default router;
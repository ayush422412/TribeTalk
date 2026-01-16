// repositories/message.repository.js
// import { Message } from "../Models/Message.model.js";

// export const createMessage = async (data) => {
//   return Message.create(data);
// };

// Repository/Message.repository.js
// Repository/Message.repository.js (WITHOUT TRANSACTIONS - for standalone MongoDB)
import { Message } from "../Models/Message.model.js";
import { Channel } from "../Models/Channel.model.js";

/**
 * Create a new message with auto-incremented sequence number
 * NOTE: Without transactions, there's a tiny race condition risk
 * For production, use replica set + transactions
 */
export const createMessage = async ({ content, sender, channel, clientId = null, isSystemMessage = false }) => {
  try {
    // Get and increment the channel's message sequence atomically
    const updatedChannel = await Channel.findByIdAndUpdate(
      channel,
      { 
        $inc: { messageSequence: 1 },
        lastMessageAt: new Date()
      },
      { new: true }
    );

    if (!updatedChannel) {
      throw new Error("Channel not found");
    }

    // Create message with the new sequence number
    const message = await Message.create({
      content,
      sender,
      channel,
      sequence: updatedChannel.messageSequence,
      clientId,
      isSystemMessage
    });

    // Update channel's lastMessageId
    await Channel.findByIdAndUpdate(
      channel,
      { lastMessageId: message._id }
    );

    return message;
  } catch (error) {
    throw error;
  }
};

/**
 * Get messages with cursor-based pagination
 */
export const getMessages = async ({ 
  channelId, 
  limit = 50, 
  before = null,
  after = null
}) => {
  const query = { 
    channel: channelId,
    deletedAt: null
  };

  let sortOrder = -1;

  if (before) {
    const beforeMsg = await Message.findById(before);
    if (beforeMsg) {
      query.sequence = { $lt: beforeMsg.sequence };
    }
  } else if (after) {
    const afterMsg = await Message.findById(after);
    if (afterMsg) {
      query.sequence = { $gt: afterMsg.sequence };
      sortOrder = 1;
    }
  }

  const messages = await Message.find(query)
    .sort({ sequence: sortOrder })
    .limit(Math.min(limit, 100))
    .populate("sender", "username avatar")
    .lean();

  if (after) {
    messages.reverse();
  }

  return messages;
};

/**
 * Get messages after a specific sequence (for sync/reconnect)
 */
export const getMessagesSinceSequence = async (channelId, sinceSequence) => {
  return Message.find({
    channel: channelId,
    sequence: { $gt: sinceSequence },
    deletedAt: null
  })
    .sort({ sequence: 1 })
    .populate("sender", "username avatar")
    .lean();
};

/**
 * Update message content (edit)
 */
export const updateMessage = async (messageId, content, userId) => {
  const message = await Message.findOne({ 
    _id: messageId,
    sender: userId,
    deletedAt: null
  });

  if (!message) {
    throw new Error("Message not found or you don't have permission");
  }

  message.content = content;
  message.isEdited = true;
  message.editedAt = new Date();
  
  await message.save();
  return message;
};

/**
 * Soft delete a message
 */
export const deleteMessage = async (messageId, userId) => {
  const message = await Message.findOne({ 
    _id: messageId,
    sender: userId,
    deletedAt: null
  });

  if (!message) {
    throw new Error("Message not found or you don't have permission");
  }

  message.deletedAt = new Date();
  message.content = "[Message deleted]";
  
  await message.save();
  return message;
};

/**
 * Get latest message in a channel
 */
export const getLatestMessage = async (channelId) => {
  return Message.findOne({ 
    channel: channelId,
    deletedAt: null
  })
    .sort({ sequence: -1 })
    .lean();
};

/**
 * Count unread messages for a user in a channel
 */
export const countUnreadMessages = async (channelId, lastReadSequence) => {
  return Message.countDocuments({
    channel: channelId,
    sequence: { $gt: lastReadSequence },
    deletedAt: null
  });
};
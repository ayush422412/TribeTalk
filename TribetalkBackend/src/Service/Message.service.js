// services/message.service.js
// import * as messageRepo from "../Repository/Message.repository.js";
// import { ApiError } from "../Utils/ApiError.js";

// export const addMessage = async ({ content, channelId,UserId }) => {
//   if (!content?.trim()) {
//     throw new ApiError(400, "Message cannot be empty");
//   }
//   if (!UserId || !channelId) {
//     throw new ApiError(400, "UserId and ChannelId are required");
//   }
//   // later to implement for server too
//   console.log(UserId,content,channelId)

//   return messageRepo.createMessage({
//     content,
//     sender: UserId,
//     channel: channelId
//   });
// };

// Service/Message.service.js (UPDATED)
import * as messageRepo from "../Repository/Message.repository.js";
import { ReadState } from "../Models/ReadState.model.js";
import { ApiError } from "../Utils/ApiError.js";

/**
 * Add a new message
 */
export const addMessage = async ({ content, channelId, UserId, clientId = null, isSystemMessage = false }) => {
  if (!content?.trim() && !isSystemMessage) {
    throw new ApiError(400, "Message cannot be empty");
  }
  if (!UserId || !channelId) {
    throw new ApiError(400, "UserId and ChannelId are required");
  }

  return messageRepo.createMessage({
    content,
    sender: UserId,
    channel: channelId,
    clientId,
    isSystemMessage
  });
};

/**
 * Get message history with cursor pagination
 */
export const getMessageHistory = async ({ channelId, limit = 50, before = null, after = null }) => {
  return messageRepo.getMessages({ channelId, limit, before, after });
};

/**
 * Get messages since a specific sequence (for reconnect/sync)
 */
export const getMissedMessages = async (channelId, sinceSequence) => {
  return messageRepo.getMessagesSinceSequence(channelId, sinceSequence);
};

/**
 * Edit a message
 */
export const editMessage = async (messageId, content, userId) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Message content cannot be empty");
  }
  return messageRepo.updateMessage(messageId, content, userId);
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId, userId) => {
  return messageRepo.deleteMessage(messageId, userId);
};

/**
 * Mark messages as read
 */
export const markAsRead = async (userId, channelId, lastReadMessageId) => {
  const message = await messageRepo.getLatestMessage(channelId);
  
  if (!message && !lastReadMessageId) {
    // No messages in channel yet
    return null;
  }

  const messageToMark = lastReadMessageId 
    ? await messageRepo.getMessages({ channelId, limit: 1, before: null, after: null })
        .then(msgs => msgs.find(m => m._id.toString() === lastReadMessageId))
    : message;

  if (!messageToMark) {
    throw new ApiError(404, "Message not found");
  }

  const readState = await ReadState.findOneAndUpdate(
    { user: userId, channel: channelId },
    {
      lastReadMessageId: messageToMark._id,
      lastReadSequence: messageToMark.sequence,
      lastReadAt: new Date()
    },
    { upsert: true, new: true }
  );

  return readState;
};

/**
 * Get unread count for a channel
 */
export const getUnreadCount = async (userId, channelId) => {
  const readState = await ReadState.findOne({ user: userId, channel: channelId });
  const lastReadSequence = readState?.lastReadSequence || 0;

  return messageRepo.countUnreadMessages(channelId, lastReadSequence);
};


export const getUnreadCountsForUser=async (userId) => {
  const readStates = await ReadState.find({ user: userId});
  // const lastReadSequence = readState?.lastReadSequence || 0;
  console.log("readState",readStates)
  const unreadCounts={}
  for(const readState of readStates){
    const channelId=readState.channel._id
    const lastReadSequence=readState?.lastReadSequence || 0;
    const count=await messageRepo.countUnreadMessages(channelId, lastReadSequence)
    unreadCounts[channelId]=count

  }
  console.log("unreadcounts",unreadCounts)

  return unreadCounts;
};


/**
 * Get read state for a user in a channel
 */
export const getReadState = async (userId, channelId) => {
  return ReadState.findOne({ user: userId, channel: channelId });
};

/**
 * Get channel sync data (latest message + unread count)
 */
export const getChannelSyncData = async (userId, channelId) => {
  const latestMessage = await messageRepo.getLatestMessage(channelId);
  const readState = await getReadState(userId, channelId);
  const unreadCount = await getUnreadCount(userId, channelId);

  return {
    latestMessageId: latestMessage?._id || null,
    latestSequence: latestMessage?.sequence || 0,
    lastReadSequence: readState?.lastReadSequence || 0,
    unreadCount
  };
};

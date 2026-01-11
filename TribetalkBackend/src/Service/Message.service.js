// services/message.service.js
import * as messageRepo from "../repositories/message.repository.js";
import { ApiError } from "../Utils/ApiError.js";

export const addMessage = async ({ content, UserId, channelId }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Message cannot be empty");
  }
  if (!UserId || !channelId) {
    throw new ApiError(400, "UserId and ChannelId are required");
  }
  // later to implement for server too

  return messageRepo.createMessage({
    content,
    sender: UserId,
    channel: channelId
  });
};

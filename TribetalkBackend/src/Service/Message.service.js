// services/message.service.js
import * as messageRepo from "../Repository/Message.repository.js";
import { ApiError } from "../Utils/ApiError.js";

export const addMessage = async ({ content, channelId,UserId }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Message cannot be empty");
  }
  if (!UserId || !channelId) {
    throw new ApiError(400, "UserId and ChannelId are required");
  }
  // later to implement for server too
  console.log(UserId,content,channelId)

  return messageRepo.createMessage({
    content,
    sender: UserId,
    channel: channelId
  });
};

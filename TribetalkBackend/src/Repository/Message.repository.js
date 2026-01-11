// repositories/message.repository.js
import { Message } from "../Models/Message.model.js";

export const createMessage = async (data) => {
  return Message.create(data);
};



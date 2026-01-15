import { getServerInfo } from "../Controllers/Server.controller.js";

export const currentServer = async () => {
  const server = await getServerInfo();

  if (!server || !server._id) {
    throw new Error("Server not found");
  }

  return server._id;
};

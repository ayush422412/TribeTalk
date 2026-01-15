export const userCanJoin = async ({ userId, serverId }) => {
  const server = await Server.findOne({
    _id: serverId,
    members: userId
  });

  if (!server) {
    throw new Error("Join server first");
  }

  return true;
};

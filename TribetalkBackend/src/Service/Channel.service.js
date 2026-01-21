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

export const channelActivity = async ({channelId }) => {
  const channel = await Channel.findOne({
    _id: channelId
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  return  channelId ;channel._id;
};



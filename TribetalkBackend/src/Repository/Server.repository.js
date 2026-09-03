import { Server } from "../Models/Server.model.js";
import { Channel } from "../Models/Channel.model.js";

export const findServerByNameAndOwner = async (name, ownerId) => {
    return await Server.findOne({ name, owner: ownerId });
};

export const createServerDoc = async (data) => {
    return await Server.create(data);
};

export const findServerById = async (serverId) => {
    return await Server.findById(serverId);
};

export const deleteServerById = async (serverId) => {
    return await Server.findByIdAndDelete(serverId);
};

export const findServersForUser = async (userId) => {
    return await Server.find({
        $or: [
            { owner: userId },
            { moderators: userId },
            { members: userId }
        ]
    })
        .select("name _id description owner moderators members")
        .sort({ createdAt: -1 })
        .lean();
};

export const saveServerDoc = async (serverDoc) => {
    return await serverDoc.save();
};

export const findServerWithPopulatedUsers = async (serverId) => {
    return await Server.findById(serverId)
        .populate("owner", "username")
        .populate("moderators", "username")
        .populate("members", "username");
};

export const findChannelsByServerId = async (serverId) => {
    return await Channel.find({ server: serverId })
        .select("_id name type description")
        .sort({ createdAt: 1 })
        .lean();
};

export const addMemberToServer = async (serverId, userId) => {
    return await Server.findByIdAndUpdate(
        serverId,
        { $addToSet: { members: userId } },
        { new: true }
    );
};
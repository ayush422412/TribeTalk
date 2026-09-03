export function formatMessageDTO(message) {
    const sender =
        message.user ||
        message.UserId ||
        null;

    return {
        id: message._id.toString(),
        content: message.content,
        senderId:
            sender?._id?.toString() ||
            (typeof sender === "string" ? sender : null),
        senderUsername: sender?.username || null,
        senderAvatar: sender?.avatar || null,
        channelId:
            message.channelId?.toString?.() ||
            message.channel?.toString(),
        sequence: message.sequence,
        timestamp: message.createdAt.toISOString(),
        isEdited: message.isEdited || false,
        editedAt: message.editedAt?.toISOString() || null,
        isSystemMessage: message.isSystemMessage || false,
        clientId: message.clientId || null
    };
}
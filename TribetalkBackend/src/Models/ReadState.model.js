// Models/ReadState.model.js (NEW)
import mongoose, { Schema, Types } from "mongoose";

const readStateSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    channel: {
      type: Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    // Last message the user has read
    lastReadMessageId: {
      type: Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Sequence number of last read message (for efficient counting)
    lastReadSequence: {
      type: Number,
      default: 0,
    },

    // When the user last read the channel
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Unique constraint: one read state per user per channel
readStateSchema.index({ user: 1, channel: 1 }, { unique: true });

// Index for efficient queries
readStateSchema.index({ channel: 1 });

export const ReadState = mongoose.model("ReadState", readStateSchema);
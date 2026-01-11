import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },


    channel: {
      type: Types.ObjectId,
      ref: "Channel",
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);


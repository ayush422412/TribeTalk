import mongoose, { Schema, Types } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 30,
    },

    server: {
      type: Types.ObjectId,
      ref: "Server",
      required: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },

    description: {
      type: String,
      default: "",
      maxlength: 100,
    },
  },
  { timestamps: true }
);

export const Channel = mongoose.model("Channel", channelSchema);

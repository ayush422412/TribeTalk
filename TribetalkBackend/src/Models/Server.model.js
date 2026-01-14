import mongoose, { Schema, Types } from "mongoose";

const serverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    description: {
      type: String,
      maxlength: 200,
      default: "",
    },

    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    moderators: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// export default mongoose.model("Server", serverSchema);

export const Server = mongoose.model("Server", serverSchema)
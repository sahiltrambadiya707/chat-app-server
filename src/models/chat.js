const mongoose = require("mongoose");

//Define a schema
const modelSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", modelSchema);
module.exports = Chat;

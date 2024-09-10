import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      ref: "Comment",
      required: true,
    },
    userProfilePic: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  { timestamps: true }
);
const Reply = mongoose.model("Reply", replySchema);
export default Reply;

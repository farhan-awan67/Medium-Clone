import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;

import Comments from "../models/comments.model";
import Post from "../models/post.model";

import { io } from "../server.js"; // wherever your socket server is
import Comments from "../models/commentsModel.js";
import Post from "../models/postModel.js";
import Notifications from "../models/notificationModel.js";

// POST /api/comments
export const createComment = asyncHandler(async (req, res) => {
  const { postId, body, parent } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const comment = new Comments({
    post: postId,
    author: userId,
    body,
    parent: parent || null,
  });
  await comment.save();

  const populatedComment = await Comments.findById(comment._id).populate(
    "author",
    "username avatar"
  );

  io.emit("comment:new", populatedComment);

  // 🔔 Notification logic
  let recipient = null;
  let type = null;

  if (parent) {
    const parentComment = await Comments.findById(parent).populate("author");
    if (parentComment && !parentComment.author._id.equals(userId)) {
      recipient = parentComment.author._id;
      type = "reply";
    }
  } else if (!post.author.equals(userId)) {
    recipient = post.author;
    type = "comment";
  }

  if (recipient && type) {
    const notification = new Notifications({
      user: recipient,
      actor: userId,
      type,
      post: postId,
      comment: comment._id,
    });
    await notification.save();

    const recipientSocket = onlineUsers.get(recipient.toString());
    if (recipientSocket) {
      io.to(recipientSocket).emit("notification:new", notification);
    }
  }

  res.status(201).json({ success: true, comment: populatedComment });
});

// GET /api/comments/:postId
export const getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const comments = await Comments.find({ post: postId, parent: null })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 })
    .lean();

  const commentIds = comments.map((comment) => comment._id);

  const replies = await Comments.find({ parent: { $in: commentIds } })
    .populate("author", "username avatar")
    .sort({ createdAt: 1 }) // oldest replies first
    .lean();

  const repliesMap = {};
  replies.forEach((reply) => {
    const parentId = reply.parent.toString();
    if (!repliesMap[parentId]) repliesMap[parentId] = [];
    repliesMap[parentId].push(reply);
  });

  const result = comments.map((comment) => ({
    ...comment,
    replies: repliesMap[comment._id.toString()] || [],
  }));

  res.status(200).json({ success: true, comments: result });
});

// PUT /api/comments/:id
export const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const { body } = req.body;

  const comment = await Comments.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (!comment.author.equals(userId)) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  comment.body = body;
  await comment.save();

  const updatedComment = await Comments.findById(commentId).populate(
    "author",
    "username avatar"
  );

  // Emit socket event
  io.emit("comment:update", updatedComment);

  res.status(200).json({
    success: true,
    message: "Comment updated",
    comment: updatedComment,
  });
});

// DELETE /api/comments/:id
export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;

  const comment = await Comments.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (!comment.author.equals(userId)) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Delete all replies
  await Comments.deleteMany({ parent: commentId });

  // Delete the original comment
  await comment.deleteOne();

  // Emit socket event
  io.emit("comment:delete", commentId);

  res
    .status(200)
    .json({ success: true, message: "Comment and replies deleted" });
});

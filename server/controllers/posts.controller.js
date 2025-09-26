import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create post
export const createPost = asyncHandler(async (req, res) => {
  const { title, bodyHtml, tags, status, bodyDoc } = req.body;
  console.log(req.body);
  const author = req.user._id;
  console.log(author);
  if (!title || !bodyHtml) {
    return res.status(400).json({ message: "Title and body are required" });
  }
  const post = new Post({ title, bodyHtml, tags, status, author, bodyDoc });

  await post.save();

  res
    .status(201)
    .json({ success: true, message: "post created successfully", post });
});

// get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "published" })
    .populate("author", "username avatarUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, posts });
});

// get single post by slug
export const singlePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name username avatar");

  if (!post) {
    return res
      .status(404)
      .json({ success: false, message: "no post available" });
  }

  return res.status(200).json({ success: true, post });
});

// update post by slug
export const updatePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;

  const post = await Post.findOne({ slug });
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  // Optional: check if req.user._id === post.author before allowing update
  if (!post.author.equals(req.user._id))
    return res.status(401).json({ success: false, message: "not authorized" });

  const updatedPost = await Post.findOneAndUpdate({ slug }, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost,
  });
});

// PUT /api/posts/:id/like
// toggleLikes
export const toggleLikes = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: isLiked ? "Post unliked" : "Post liked",
    likeCount: post.likes.length,
  });
});

// delete post
export const deletePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug });
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  // Optional: check if the logged-in user is the author
  if (!post.author.equals(req.user._id))
    return res.status(403).json({ message: "Not authorized" });

  await Post.findOneAndDelete({ slug });

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

import slugify from "slugify";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Tags from "../models/tags.model.js";
import Notifications from "../models/notifications.model.js";
import { sendNotification } from "../server.js";

// const calculateReadTime = (text) => {
//   // Remove HTML tags if bodyHtml is used
//   const plainText = text.replace(/<[^>]+>/g, "");
//   const words = plainText.trim().split(/\s+/).length; // count words
//   const wordsPerMinute = 200; // average reading speed
//   const minutes = Math.ceil(words / wordsPerMinute);
//   return minutes;
// };

// create post
export const createPost = asyncHandler(async (req, res) => {
  const { title, bodyHtml, tags, status } = req.body;
  const author = req.user._id;
  const file = req.file;
  const tagsArray = tags.split(",").map((tag) => tag.trim());

  if (!title || !bodyHtml) {
    return res.status(400).json({ message: "Title and body are required" });
  }
  // Generate excerpt from HTML
  const stripHtml = bodyHtml.replace(/<[^>]+>/g, ""); // remove HTML tags
  const excerpt =
    stripHtml.length > 200 ? stripHtml.substring(0, 200) + "..." : stripHtml;

  // Calculate read time
  // const readTime = calculateReadTime(bodyHtml);

  const post = new Post({
    title,
    bodyHtml,
    tags: tagsArray,
    status,
    excerpt,
    author,
    coverImage: file.path,
  });

  await post.save();

  if (tags && tags.length > 0) {
    for (let tagName of tags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");

      const tag = await Tags.findOne({ slug });
      if (tag) {
        tag.postCount += 1;
        await tag.save();
      } else {
        new Tags({
          name: tagName,
          slug,
          postCount: 1,
        });
      }
    }
  }

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

  let isLiked = post.likes.includes(userId);

  if (isLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);

    if (userId !== post.author.toString()) {
      const newNotification = new Notifications({
        user: post.author,
        actor: userId,
        type: "like",
        post: postId,
        comment: null,
        read: false,
      });
      await newNotification.save();
      const notification = await Notifications.findById(newNotification._id)
        .populate("user", "username avatarUrl")
        .populate("post", "title");
      sendNotification(post.author.toString(), notification);
    }
  }

  await post.save();
  // Update isLiked AFTER toggling
  isLiked = post.likes.includes(userId);

  res.status(200).json({
    success: true,
    message: isLiked ? "Post unliked" : "Post liked",
    like: isLiked,
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

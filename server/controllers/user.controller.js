import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";

// cookies option
const options = {
  httpOnly: true,
  secure: true,
};

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // validating body
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "minimun length for username is 3",
    });
  }

  //   cheking for esixting user
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "user already exist" });
  }

  // if not then we have to create
  const user = await User({ username, email, password });
  await user.save();

  const token = user.generateToken();

  return res
    .status(201)
    .cookie("token", token, options)
    .json({ success: true, message: "user register successfully", token });
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // validating body

  // Check: either username OR email must be provided
  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  } // Check: password is required
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  // looking for user in db
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    return res.status(404).json({ success: false, message: "user not found" });
  }

  // comparing password
  const isCorrect = await user.comparePassword(password);
  if (!isCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "invalid credentiols" });
  }

  const token = await user.generateToken();

  return res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, message: "login successfully", token });
});

// user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // lets find user in db
  const user = await User.findOne({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", options)
    .json({ success: true, message: "log out successfully" });
});

// togglefollowunfollow user
export const toggleFollowUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const userId = req.user._id;

  if (targetUserId === userId.toString()) {
    return res
      .status(400)
      .json({ success: false, message: "You cannot follow yourself." });
  }

  const me = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!me || !targetUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isFollowing = me.following.includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    me.following.pull(targetUserId);
    targetUser.followers.pull(userId);
    await me.save();
    await targetUser.save();
    return res.status(200).json({ success: true, message: "Unfollowed" });
  } else {
    // Follow
    me.following.push(targetUserId);
    targetUser.followers.push(userId);
    await me.save();
    await targetUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Followed", isFollowing });
  }
});

// toggle bookmark
export const toggleBookmarkPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const me = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!me || !post) {
    return res
      .status(404)
      .json({ success: false, message: "User or Post not found" });
  }

  const isBookmarked = me.bookmarks.includes(postId);

  if (isBookmarked) {
    // Unbookmark
    me.bookmarks.pull(postId);
    post.bookmarks.pull(userId);
    await me.save();
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post unbookmarked" });
  } else {
    // Bookmark
    me.bookmarks.push(postId);
    post.bookmarks.push(userId);
    await me.save();
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post bookmarked", isBookmarked });
  }
});

// export const followUser = asyncHandler(async (req, res) => {
//   const targetUserId = req.params.id;
//   const userId = req.user._id;

//   if (targetUserId === userId.toString()) {
//     return res
//       .status(400)
//       .json({ success: false, message: "You cannot follow yourself." });
//   }

//   const me = await User.findById(userId);
//   const targetUser = await User.findById(targetUserId);

//   if (!me || !targetUser) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   if (!me.following.includes(targetUserId)) {
//     me.following.push(targetUserId);
//     await me.save();

//     if (!targetUser.followers.includes(userId)) {
//       targetUser.followers.push(userId);
//       await targetUser.save();
//     }
//   }

//   return res.status(200).json({ success: true, message: "Followed" });
// });

// unfollow user

// export const unfollowUser = asyncHandler(async (req, res) => {
//   const targetUserId = req.params.id;
//   const userId = req.user._id;

//   const me = await User.findById(userId);
//   const targetUser = await User.findById(targetUserId);

//   if (!me || !targetUser) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   if (me.following.includes(targetUserId)) {
//     me.following.pull(targetUserId);
//     await me.save();

//     if (targetUser.followers.includes(userId)) {
//       targetUser.followers.pull(userId);
//       await targetUser.save();
//     }
//   }

//   return res.status(200).json({ success: true, message: "Unfollowed" });
// });

// bookmarks

// export const userBookmarks = asyncHandler(async (req, res) => {
//   const postId = req.params.id;
//   const userId = req.user._id;

//   const me = await User.findById(userId);
//   const post = await Post.findById(postId);

//   if (!me || !post) {
//     return res
//       .status(404)
//       .json({ success: false, message: "User or Post not found" });
//   }

//   if (!me.bookmarks.includes(postId)) {
//     me.bookmarks.push(postId);
//     await me.save();

//     if (!post.bookmarks.includes(userId)) {
//       post.bookmarks.push(userId);
//       await post.save();
//     }
//   }

//   return res.status(200).json({ success: true, message: "Post bookmarked" });
// });

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";
import Notifications from "../models/notifications.model.js";

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
  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    "+password"
  );
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

  const isFollowing = me.following
    .map((id) => id.toString())
    .includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    me.following.pull(targetUserId);
    targetUser.followers.pull(userId);
    await me.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Unfollowed",
      isFollowing: false,
      followersCount: targetUser.followers.length,
      followingCount: me.following.length,
    });
  } else {
    // Follow
    me.following.push(targetUserId);
    targetUser.followers.push(userId);
    await me.save();
    await targetUser.save();

    // Avoid duplicate follow notifications
    const existingFollowNotif = await Notifications.findOne({
      user: targetUserId,
      actor: userId,
      type: "follow",
    });

    if (!existingFollowNotif) {
      const notification = new Notifications({
        user: targetUserId,
        actor: userId,
        type: "follow",
      });
      await notification.save();
    }

    // 🔌 OPTIONAL: Emit socket event (see below)
    // 🔌 Emit Socket.IO follow notification
    const targetSocketId = onlineUsers.get(targetUserId.toString());
    if (targetSocketId) {
      io.to(targetSocketId).emit("new-notification", {
        type: "follow",
        actor: {
          _id: userId,
          username: me.username,
        },
        createdAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Followed",
      isFollowing: true,
      followersCount: targetUser.followers.length,
      followingCount: me.following.length,
    });
  }
});

// toggle bookmark
export const toggleBookmarkPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const me = await User.findById(userId);
  const post = await Post.findById(postId).populate("author");

  if (!me || !post) {
    return res
      .status(404)
      .json({ success: false, message: "User or Post not found" });
  }

  const isBookmarked = me.bookmarks.map((id) => id.toString()).includes(postId);

  if (isBookmarked) {
    // Unbookmark
    me.bookmarks.pull(postId);
    post.bookmarks.pull(userId);
    await me.save();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post unbookmarked",
      isBookmarked: false,
    });
  } else {
    // Bookmark
    me.bookmarks.push(postId);
    post.bookmarks.push(userId);
    await me.save();
    await post.save();

    const targetUserId = post.author._id.toString();

    // Avoid notifying self
    if (targetUserId !== userId.toString()) {
      const existingNotification = await Notifications.findOne({
        user: targetUserId,
        actor: userId,
        post: postId,
        type: "bookmark",
      });

      if (!existingNotification) {
        const notification = new Notifications({
          user: targetUserId,
          actor: userId,
          post: postId,
          type: "bookmark",
        });
        await notification.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post bookmarked",
      isBookmarked: true,
    });
  }
});

// get user notifcations
export const userNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  //  find user notifications and validate
  const notifications = await Notifications.find({ user: userId })
    .populate("actor", "username name")
    .sort({
      createdAt: -1,
    });
  console.log(notifications);
  if (!notifications) {
    return res
      .status(404)
      .json({ success: false, message: "no notifications." });
  }

  // if user notifications found then
  let message = notifications.map((notif) => {
    const message = `${notif?.actor?.username} ${notif?.type} your post`;
    return message;
  });

  return res.status(200).json({
    success: true,
    message,
    notifications,
  });
});

// read notification
export const readNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notificationId = req.params.id;

  const notification = await Notifications.findById(notificationId);

  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "No notification found" });
  }

  // Check ownership (optional but recommended)
  if (notification.user.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  // Mark as read
  notification.read = true;
  await notification.save();

  // Get related post (if applicable)
  let post = null;
  if (notification.post) {
    post = await Post.findById(notification.post.toString());
  }

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
    post,
  });
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

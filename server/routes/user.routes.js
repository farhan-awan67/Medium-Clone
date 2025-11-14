import express from "express";
const router = express.Router();
import {
  getSpecificUserProfie,
  getUserProfile,
  loginUser,
  logoutUser,
  markAllNotificationsAsRead,
  readNotification,
  registerUser,
  toggleBookmarkPost,
  toggleFollowUser,
  updateUserProfile,
  userNotifications,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// register route
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.get("/user/:id/profile", getSpecificUserProfie);
router.post(
  "/profile",
  verifyToken,
  upload.single("avatarUrl"),
  updateUserProfile
);
router.post("/logout", logoutUser);
router.put("/follow/:id", verifyToken, toggleFollowUser);
router.put("/bookmark/:id", verifyToken, toggleBookmarkPost);

export default router;

import express from "express";
const router = express.Router();
import {
  getUserProfile,
  loginUser,
  logoutUser,
  readNotification,
  registerUser,
  toggleBookmarkPost,
  toggleFollowUser,
  userNotifications,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";

// register route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", logoutUser);
router.put("/follow/:id", verifyToken, toggleFollowUser);
router.put("/bookmark/:id", verifyToken, toggleBookmarkPost);
router.get("/user/notifications", verifyToken, userNotifications);
router.get("/user/notifications/:id", verifyToken, readNotification);

export default router;

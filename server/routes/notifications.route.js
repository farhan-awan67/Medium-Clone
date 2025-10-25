import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  markAllNotificationsAsRead,
  readNotification,
  userNotifications,
} from "../controllers/user.controller.js";
const router = express.Router();

// get unread notifications
router.get("/unread", verifyToken, userNotifications);
router.get("/:id/unread", verifyToken, readNotification);
router.put("/mark-all-read", verifyToken, markAllNotificationsAsRead);

export default router;

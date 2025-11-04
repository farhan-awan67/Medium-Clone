import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "../controllers/comments.controller.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/:postId/comment", verifyToken, createComment);
router.put("/comment/:id", verifyToken, updateComment);
router.delete("/comment/:id", verifyToken, deleteComment);

export default router;

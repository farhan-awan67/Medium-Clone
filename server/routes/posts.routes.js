import express from "express";
import {
  createPost,
  getAllPosts,
  singlePost,
  toggleLikes,
  updatePost,
} from "../controllers/posts.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// posts routes
router.post("/create-post", verifyToken, createPost);
router.get("/posts", verifyToken, getAllPosts);
router.get("/posts/:slug", verifyToken, singlePost);
router.put("/update-post/:slug", verifyToken, updatePost);
router.put("/posts/:id/like", verifyToken, toggleLikes);
router.delete("/delete-post/:slug", verifyToken, updatePost);

export default router;

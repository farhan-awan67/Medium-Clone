import express from "express";
import {
  createPost,
  getAllPosts,
  singlePost,
  toggleLikes,
  updatePost,
} from "../controllers/posts.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// posts routes
router.post(
  "/create-post",
  upload.single("coverImage"),
  verifyToken,
  createPost
);
router.get("/posts", getAllPosts);
router.get("/posts/:slug", singlePost);
router.put("/update-post/:slug", updatePost);
router.put("/posts/:id/like", toggleLikes);
router.delete("/delete-post/:slug", updatePost);

export default router;

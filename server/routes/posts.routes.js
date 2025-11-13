import express from "express";
import {
  createPost,
  deletePost,
  draftPost,
  getAllPosts,
  makePostPublish,
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
router.post("/draft-post", upload.single("coverImage"), verifyToken, draftPost);
router.get("/", getAllPosts);
router.get("/:slug", singlePost);
router.put(
  "/update-post/:slug",
  upload.single("coverImage"),
  verifyToken,
  updatePost
);
router.patch("/publish/:id", verifyToken, makePostPublish);
router.put("/:id/like", verifyToken, toggleLikes);
router.delete("/delete-post/:slug", verifyToken, deletePost);

export default router;

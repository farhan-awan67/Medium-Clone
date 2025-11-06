import express from "express";
import { getTrendingTags } from "../controllers/tagsController.controller.js";

const router = express.Router();

router.get("/trending-tags", getTrendingTags);

export default router;

import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTrendingTags = asyncHandler(async (req, res) => {
  // Get posts from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Aggregate trending tags
  const trendingTags = await Post.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Optional: make response cleaner
  const formatted = trendingTags.map((tag) => ({
    name: tag._id,
    count: tag.count,
  }));

  res.status(200).json({
    success: true,
    tags: formatted,
  });
});

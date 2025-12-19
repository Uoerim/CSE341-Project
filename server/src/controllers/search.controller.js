// Get trending posts (most liked)
export const trendingPosts = async (req, res, next) => {
  try {
    // Top 5 posts by upvotes length, only published
    const posts = await Post.find({ status: "published" })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(5)
      .select("title content community author upvotes createdAt images")
      .populate("community", "name")
      .populate("author", "username");
    // Add likeCount for frontend
    const trending = posts.map(post => ({
      ...post.toObject(),
      likeCount: post.upvotes.length
    }));
    res.json({ trending });
  } catch (err) {
    next(err);
  }
};
// src/controllers/search.controller.js
import User from "../models/User.js";
import Community from "../models/Community.js";
import Post from "../models/Post.js";
import { BadRequestError } from "../utils/httpErrors.js";

export const globalSearch = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const type = req.query.type || "all"; // "all" | "users" | "communities" | "posts"

    const trimmed = q.trim();
    if (!trimmed) {
      throw new BadRequestError("Search query is required");
    }

    const regex = new RegExp(trimmed, "i");

    const results = {};

    if (type === "all" || type === "users") {
      results.users = await User.find({ username: regex }).select(
        "username email avatar"
      );
    }

    if (type === "all" || type === "communities") {
      results.communities = await Community.find({
        $or: [{ name: regex }, { description: regex }],
      }).select("name description");
    }

    if (type === "all" || type === "posts") {
      results.posts = await Post.find({
        $or: [{ title: regex }, { content: regex }],
      })
        .select("title content community author createdAt")
        .populate("community", "name")
        .populate("author", "username");
    }

    return res.json(results);
  } catch (err) {
    next(err);
  }
};

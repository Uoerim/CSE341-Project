import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  getFeedPosts,
  getRecentPosts,
  summarizePost,
  getUserDrafts,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Specific routes (must come before dynamic :id routes)
router.get("/feed", getFeedPosts);
router.get("/recent", getRecentPosts);
router.get("/user/drafts", protect, getUserDrafts);

// Dynamic routes (come last)
router.post("/", protect, createPost);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/upvote", protect, upvotePost);
router.put("/:id/downvote", protect, downvotePost);
router.post("/:id/summarize", summarizePost);

// Generic GET (all posts)
router.get("/", getAllPosts);

export default router;

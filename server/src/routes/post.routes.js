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
  getPopularPosts,
  getTrendingPosts,
  summarizePost,
  getUserDrafts,
  savePost,
  hidePost,
  addToHistory,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/trending", getTrendingPosts);
router.get("/popular", getPopularPosts);
router.get("/feed", getFeedPosts);
router.get("/recent", getRecentPosts);
router.get("/user/drafts", protect, getUserDrafts);
router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/upvote", protect, upvotePost);
router.put("/:id/downvote", protect, downvotePost);
router.put("/:id/save", protect, savePost);
router.put("/:id/hide", protect, hidePost);
router.put("/:id/history", protect, addToHistory);
router.post("/:id/summarize", summarizePost);

export default router;

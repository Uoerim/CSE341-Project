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
  summarizePost,
  getUserDrafts,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", getFeedPosts);
router.get("/user/drafts", protect, getUserDrafts);
router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/upvote", protect, upvotePost);
router.put("/:id/downvote", protect, downvotePost);
router.post("/:id/summarize", summarizePost);

export default router;

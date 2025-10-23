import express from "express";
import { upvotePost, downvotePost } from "../controllers/post.controller.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

// CRUD endpoints
router.post("/", protect, createPost);        // CREATE
router.get("/", getAllPosts);       // READ all
router.get("/:id", getPostById);    // READ one
router.put("/:id", updatePost);     // UPDATE
router.delete("/:id", deletePost);  // DELETE
router.put("/:id/upvote", protect, upvotePost); // UPVOTE
router.put("/:id/downvote", protect, downvotePost); // DOWNVOTE

export default router;

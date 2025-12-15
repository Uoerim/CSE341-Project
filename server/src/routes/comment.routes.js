import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createComment,
  getCommentsByPost,
  getRepliesByComment,
  deleteComment,
  getAllComments,
  updateComment,
  upvoteComment,
  downvoteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/post/:postId", getCommentsByPost);
router.get("/:commentId/replies", getRepliesByComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.put("/:id/upvote", protect, upvoteComment);
router.put("/:id/downvote", protect, downvoteComment);
router.get("/", getAllComments);

export default router;

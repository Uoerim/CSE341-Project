import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/post/:postId", getCommentsByPost);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.get("/", getAllComments);

export default router;

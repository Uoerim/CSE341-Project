import express from "express";
import { protect } from "../middleware/auth.js";
import { createComment, getCommentsByPost, deleteComment,getAllComments  } from "../controllers/comment.controller.js";

const router = express.Router();


router.post("/", protect, createComment);
router.get("/post/:postId", getCommentsByPost);
router.delete("/:id", deleteComment);
router.get("/", getAllComments); // For testing purposes: Get all comments



export default router; // ✅ important

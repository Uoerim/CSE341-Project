import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityPosts,
} from "../controllers/community.controller.js";

const router = express.Router();


router.post("/", protect, createCommunity);
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.put("/:id", protect, updateCommunity);
router.delete("/:id", protect, deleteCommunity);
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);
router.get("/:id/posts", getCommunityPosts);

export default router;

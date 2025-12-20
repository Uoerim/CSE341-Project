import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  getCommunityByName,
  getCommunityPostsByName,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityPosts,
  updateCommunitySettings,
  addModerator,
  removeModerator,
  banUser,
  unbanUser,
  removeMember,
  getCommunityMembers,
  deletePostFromCommunity,
} from "../controllers/community.controller.js";

const router = express.Router();


router.post("/", protect, createCommunity);
router.get("/", getAllCommunities);
router.get("/r/:name", getCommunityByName);
router.get("/r/:name/posts", getCommunityPostsByName);
router.get("/:id", getCommunityById);
router.put("/:id", protect, updateCommunity);
router.put("/:id/settings", protect, updateCommunitySettings);
router.delete("/:id", protect, deleteCommunity);
router.get("/:id/join", protect, joinCommunity);
router.get("/:id/leave", protect, leaveCommunity);
router.get("/:id/posts", getCommunityPosts);
router.get("/:id/members", protect, getCommunityMembers);
router.post("/:id/moderators", protect, addModerator);
router.delete("/:id/moderators", protect, removeModerator);
router.post("/:id/ban", protect, banUser);
router.post("/:id/unban", protect, unbanUser);
router.delete("/:id/members", protect, removeMember);
router.delete("/:id/posts/:postId", protect, deletePostFromCommunity);

export default router;

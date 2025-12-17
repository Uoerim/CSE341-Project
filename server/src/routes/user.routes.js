import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  getMyProfile,
  updateMyProfile,
  searchUsersAndCommunities,
  getUserProfileByUsername,
  getUserPostsByUsername,
  getUserCommentsByUsername,
  getUserOverviewByUsername,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// search
router.get("/search", searchUsersAndCommunities);

// current logged‑in user
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// public profile by username (Reddit‑style /u/:username/…)
router.get("/u/:username/profile", getUserProfileByUsername);
router.get("/u/:username/overview", getUserOverviewByUsername);
router.get("/u/:username/posts", getUserPostsByUsername);
router.get("/u/:username/comments", getUserCommentsByUsername);

// admin / generic
router.get("/", getUsers);
router.post("/", createUser);

// fallback by Mongo id
router.get("/:id", getUserById);

export default router;

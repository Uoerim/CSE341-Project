import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  getMyProfile,
  updateMyProfile,
  searchUsersAndCommunities,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.get("/search", searchUsersAndCommunities);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);

export default router;

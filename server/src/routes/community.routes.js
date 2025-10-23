import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
} from "../controllers/community.controller.js";

const router = express.Router();

// CRUD endpoints
router.post("/", protect, createCommunity);       // CREATE
router.get("/", getAllCommunities);       // READ all
router.get("/:id", getCommunityById);     // READ one
router.put("/:id", updateCommunity);      // UPDATE
router.delete("/:id", deleteCommunity);   // DELETE

export default router;

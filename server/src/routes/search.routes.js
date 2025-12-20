import express from "express";
import { globalSearch, trendingPosts } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", globalSearch);
router.get("/trending", trendingPosts);

export default router;

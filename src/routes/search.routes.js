import express from "express";
import { searchUsersAndCommunities } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", searchUsersAndCommunities);

export default router;

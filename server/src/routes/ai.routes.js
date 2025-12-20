import express from "express";
import { chat, chatStream } from "../controllers/ai.controller.js";

const router = express.Router();

// POST /api/ai/chat - Send message and get AI response
router.post("/chat", chat);

// POST /api/ai/chat/stream - Send message and get streamed AI response
router.post("/chat/stream", chatStream);

export default router;

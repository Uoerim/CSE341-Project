import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  searchFriendsToChat,
  getUnreadCount
} from "../controllers/chat.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all chats
router.get("/", getChats);

// Get unread message count
router.get("/unread-count", getUnreadCount);

// Search friends to chat with
router.get("/search-friends", searchFriendsToChat);

// Get or create chat with a user
router.get("/user/:userId", getOrCreateChat);

// Get messages for a specific chat
router.get("/:chatId/messages", getChatMessages);

// Send a message
router.post("/:chatId/messages", sendMessage);

export default router;

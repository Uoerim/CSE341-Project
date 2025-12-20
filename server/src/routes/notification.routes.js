import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  sendModInvite,
  respondToModInvite,
  sendModMessage,
  deleteNotification
} from "../controllers/notification.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all notifications
router.get("/", getNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark all as read
router.put("/mark-all-read", markAllAsRead);

// Mark single notification as read
router.put("/:id/read", markAsRead);

// Send mod invite
router.post("/mod-invite", sendModInvite);

// Respond to mod invite
router.put("/:id/respond", respondToModInvite);

// Send message to mods
router.post("/mod-message", sendModMessage);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;

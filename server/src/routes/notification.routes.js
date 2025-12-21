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
  deleteNotification,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendshipStatus,
  removeFriend,
  cancelFriendRequest,
  getFriends
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

// Friend request routes
router.post("/friend-request/:userId", sendFriendRequest);
router.put("/friend-request/:notificationId/respond", respondToFriendRequest);
router.get("/friendship-status/:userId", getFriendshipStatus);
router.delete("/friend/:userId", removeFriend);
router.delete("/friend-request/:userId/cancel", cancelFriendRequest);
router.get("/friends/:userId", getFriends);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;

import Notification from "../models/Notification.js";
import Community from "../models/Community.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/httpErrors.js";

// GET all notifications for current user
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "username avatar")
      .populate("community", "name icon")
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// GET unread notification count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    });

    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// MARK notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not authorized");
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// MARK all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

// SEND mod invite
export const sendModInvite = async (req, res, next) => {
  try {
    const { communityId, userId } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    // Only owner can invite mods
    if (community.creator.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Only the community owner can invite moderators");
    }

    // Check if already a mod
    const isAlreadyMod = community.moderators?.some(m => m.toString() === userId);
    if (isAlreadyMod) {
      throw new BadRequestError("User is already a moderator");
    }

    // Check for existing pending invite
    const existingInvite = await Notification.findOne({
      recipient: userId,
      community: communityId,
      type: "mod_invite",
      status: "pending"
    });

    if (existingInvite) {
      throw new BadRequestError("An invite is already pending for this user");
    }

    const notification = await Notification.create({
      recipient: userId,
      sender: req.user._id,
      type: "mod_invite",
      community: communityId,
      message: `You've been invited to become a moderator of r/${community.name}`
    });

    const populated = await Notification.findById(notification._id)
      .populate("sender", "username avatar")
      .populate("community", "name icon");

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// RESPOND to mod invite (accept/decline)
export const respondToModInvite = async (req, res, next) => {
  try {
    const { response } = req.body; // "accept" or "decline"
    
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not authorized");
    }

    if (notification.type !== "mod_invite") {
      throw new BadRequestError("This is not a mod invite");
    }

    if (notification.status !== "pending") {
      throw new BadRequestError("This invite has already been responded to");
    }

    notification.status = response === "accept" ? "accepted" : "declined";
    notification.read = true;
    await notification.save();

    // If accepted, add user as moderator
    if (response === "accept") {
      const community = await Community.findById(notification.community);
      if (community) {
        community.moderators = community.moderators || [];
        if (!community.moderators.some(m => m.toString() === req.user._id.toString())) {
          community.moderators.push(req.user._id);
          await community.save();
        }
      }
    }

    res.json({ message: `Invite ${response === "accept" ? "accepted" : "declined"}`, notification });
  } catch (error) {
    next(error);
  }
};

// SEND message to mods
export const sendModMessage = async (req, res, next) => {
  try {
    const { communityId, message } = req.body;

    const community = await Community.findById(communityId)
      .populate("creator", "_id")
      .populate("moderators", "_id");
      
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    if (!message || message.trim() === "") {
      throw new BadRequestError("Message is required");
    }

    // Get all mods and owner
    const recipients = [community.creator._id];
    if (community.moderators) {
      community.moderators.forEach(mod => {
        if (mod._id.toString() !== community.creator._id.toString()) {
          recipients.push(mod._id);
        }
      });
    }

    // Create notification for each mod
    const notifications = await Promise.all(
      recipients.map(recipientId => 
        Notification.create({
          recipient: recipientId,
          sender: req.user._id,
          type: "mod_message",
          community: communityId,
          message: message.trim()
        })
      )
    );

    res.status(201).json({ message: "Message sent to moderators", count: notifications.length });
  } catch (error) {
    next(error);
  }
};

// DELETE notification
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not authorized");
    }

    await notification.deleteOne();

    res.json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

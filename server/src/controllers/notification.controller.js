import Notification from "../models/Notification.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
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

// SEND friend request
export const sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Can't send request to yourself
    if (userId === req.user._id.toString()) {
      throw new BadRequestError("Cannot send friend request to yourself");
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    // Check if already friends
    if (req.user.friends && req.user.friends.some(f => f.toString() === userId)) {
      throw new BadRequestError("Already friends with this user");
    }

    // Check if request already sent
    const existingRequest = await Notification.findOne({
      sender: req.user._id,
      recipient: userId,
      type: "friend_request",
      status: "pending"
    });

    if (existingRequest) {
      throw new BadRequestError("Friend request already sent");
    }

    // Check if there's an incoming request from this user (auto-accept)
    const incomingRequest = await Notification.findOne({
      sender: userId,
      recipient: req.user._id,
      type: "friend_request",
      status: "pending"
    });

    if (incomingRequest) {
      // Auto-accept: add both as friends
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { friends: req.user._id } });
      
      // Update the incoming request status
      incomingRequest.status = "accepted";
      await incomingRequest.save();

      return res.status(200).json({ message: "Friend request auto-accepted", status: "friends" });
    }

    // Create friend request notification
    const notification = await Notification.create({
      recipient: userId,
      sender: req.user._id,
      type: "friend_request",
      status: "pending"
    });

    res.status(201).json({ message: "Friend request sent", notification });
  } catch (error) {
    next(error);
  }
};

// RESPOND to friend request (accept/decline)
export const respondToFriendRequest = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { action } = req.body; // "accept" or "decline"

    if (!["accept", "decline"].includes(action)) {
      throw new BadRequestError("Action must be 'accept' or 'decline'");
    }

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new NotFoundError("Friend request not found");
    }

    if (notification.type !== "friend_request") {
      throw new BadRequestError("This is not a friend request");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not authorized to respond to this request");
    }

    if (notification.status !== "pending") {
      throw new BadRequestError("This request has already been responded to");
    }

    if (action === "accept") {
      // Add both users as friends
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: notification.sender } });
      await User.findByIdAndUpdate(notification.sender, { $addToSet: { friends: req.user._id } });
      
      notification.status = "accepted";
    } else {
      notification.status = "declined";
    }

    await notification.save();

    res.json({ 
      message: action === "accept" ? "Friend request accepted" : "Friend request declined",
      status: notification.status
    });
  } catch (error) {
    next(error);
  }
};

// GET friend request status between users
export const getFriendshipStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.json({ status: "self" });
    }

    // Check if already friends
    const currentUser = await User.findById(req.user._id);
    if (currentUser.friends && currentUser.friends.some(f => f.toString() === userId)) {
      return res.json({ status: "friends" });
    }

    // Check if I sent a pending request
    const sentRequest = await Notification.findOne({
      sender: req.user._id,
      recipient: userId,
      type: "friend_request",
      status: "pending"
    });

    if (sentRequest) {
      return res.json({ status: "request_sent", notificationId: sentRequest._id });
    }

    // Check if I received a pending request
    const receivedRequest = await Notification.findOne({
      sender: userId,
      recipient: req.user._id,
      type: "friend_request",
      status: "pending"
    });

    if (receivedRequest) {
      return res.json({ status: "request_received", notificationId: receivedRequest._id });
    }

    return res.json({ status: "none" });
  } catch (error) {
    next(error);
  }
};

// REMOVE friend
export const removeFriend = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      throw new BadRequestError("Cannot remove yourself as a friend");
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    // Remove from both users' friends lists
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { friends: req.user._id } });

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    next(error);
  }
};

// CANCEL sent friend request
export const cancelFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const notification = await Notification.findOneAndDelete({
      sender: req.user._id,
      recipient: userId,
      type: "friend_request",
      status: "pending"
    });

    if (!notification) {
      throw new NotFoundError("Friend request not found");
    }

    res.json({ message: "Friend request cancelled" });
  } catch (error) {
    next(error);
  }
};

// GET friends list
export const getFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate("friends", "username avatar createdAt");
    
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ friends: user.friends || [] });
  } catch (error) {
    next(error);
  }
};

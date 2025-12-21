import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/httpErrors.js";

// Get all chats for current user
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate("participants", "username avatar")
    .populate("lastMessage.sender", "username")
    .sort({ updatedAt: -1 });

    // Format chats to include the other participant info
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );
      
      // Count unread messages
      const unreadCount = chat.messages.filter(
        m => !m.read && m.sender.toString() !== req.user._id.toString()
      ).length;

      return {
        _id: chat._id,
        participant: otherParticipant,
        lastMessage: chat.lastMessage,
        unreadCount,
        updatedAt: chat.updatedAt
      };
    });

    res.json(formattedChats);
  } catch (error) {
    next(error);
  }
};

// Get or create a chat with another user
export const getOrCreateChat = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      throw new BadRequestError("Cannot start a chat with yourself");
    }

    const otherUser = await User.findById(userId);
    if (!otherUser) {
      throw new NotFoundError("User not found");
    }

    // Check if they are friends
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.friends || !currentUser.friends.some(f => f.toString() === userId)) {
      throw new ForbiddenError("You can only chat with friends");
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] }
    }).populate("participants", "username avatar");

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user._id, userId],
        messages: []
      });
      chat = await Chat.findById(chat._id).populate("participants", "username avatar");
    }

    const otherParticipant = chat.participants.find(
      p => p._id.toString() !== req.user._id.toString()
    );

    res.json({
      _id: chat._id,
      participant: otherParticipant,
      messages: chat.messages,
      updatedAt: chat.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate("participants", "username avatar")
      .populate("messages.sender", "username avatar");

    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      throw new ForbiddenError("You are not a participant in this chat");
    }

    // Mark messages as read
    let hasUnread = false;
    chat.messages.forEach(msg => {
      if (!msg.read && msg.sender._id.toString() !== req.user._id.toString()) {
        msg.read = true;
        hasUnread = true;
      }
    });
    
    if (hasUnread) {
      await chat.save();
    }

    const otherParticipant = chat.participants.find(
      p => p._id.toString() !== req.user._id.toString()
    );

    // Get paginated messages (newest first, then reverse for display)
    const startIndex = Math.max(0, chat.messages.length - (page * limit));
    const endIndex = chat.messages.length - ((page - 1) * limit);
    const messages = chat.messages.slice(startIndex, endIndex);

    res.json({
      _id: chat._id,
      participant: otherParticipant,
      messages,
      hasMore: startIndex > 0,
      updatedAt: chat.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

// Send a message
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      throw new BadRequestError("Message content is required");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      throw new ForbiddenError("You are not a participant in this chat");
    }

    const message = await chat.addMessage(req.user._id, content.trim());

    // Populate sender info for the response
    const populatedChat = await Chat.findById(chatId)
      .populate("messages.sender", "username avatar");
    
    const populatedMessage = populatedChat.messages.id(message._id);

    // Get recipient ID for socket notification
    const recipientId = chat.participants.find(
      p => p.toString() !== req.user._id.toString()
    );

    res.status(201).json({
      message: populatedMessage,
      recipientId: recipientId
    });
  } catch (error) {
    next(error);
  }
};

// Search friends to chat with
export const searchFriendsToChat = async (req, res, next) => {
  try {
    const { query } = req.query;

    const currentUser = await User.findById(req.user._id).populate("friends", "username avatar");

    if (!currentUser.friends || currentUser.friends.length === 0) {
      return res.json([]);
    }

    let friends = currentUser.friends;

    // Filter by query if provided
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i");
      friends = friends.filter(f => searchRegex.test(f.username));
    }

    res.json(friends);
  } catch (error) {
    next(error);
  }
};

// Get unread message count
export const getUnreadCount = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        if (!msg.read && msg.sender.toString() !== req.user._id.toString()) {
          totalUnread++;
        }
      });
    });

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    next(error);
  }
};

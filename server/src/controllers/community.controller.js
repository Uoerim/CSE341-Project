import Community from "../models/Community.js";
import Post from "../models/Post.js";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";


// CREATE community
export const createCommunity = async (req, res, next) => {
  try {
    const { name, description, type, topics, banner, icon } = req.body;

    if (!name) {
      throw new BadRequestError("Community name is required");
    }

    // Check for duplicate community name (case-insensitive)
    const existing = await Community.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (existing) {
      throw new BadRequestError("Community already exists");
    }

    const creator = req.user._id;

    const community = await Community.create({
      name,
      description,
      type: type || "public",
      topics: topics || [],
      banner,
      icon,
      creator,
      members: [creator],
    });

    res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};

// READ all communities
export const getAllCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find()
      .populate("creator", "username email")
      .populate("members", "username")
      .populate({
        path: "posts",
        select: "title author createdAt",
        populate: { path: "author", select: "username" },
      });

    res.json(communities);
  } catch (error) {
    next(error);
  }
};

// READ one community by ID
export const getCommunityById = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator", "username email")
      .populate("members", "username")
      .populate({
        path: "posts",
        select: "title author createdAt",
        populate: { path: "author", select: "username" },
      });

    if (!community) {
      throw new NotFoundError("Community not found");
    }

    res.json(community);
  } catch (error) {
    next(error);
  }
};

// READ one community by NAME
export const getCommunityByName = async (req, res, next) => {
  try {
    const community = await Community.findOne({ name: req.params.name })
      .populate("creator", "username email avatar")
      .populate("members", "username avatar")
      .populate("moderators", "username avatar")
      .lean();

    if (!community) {
      throw new NotFoundError("Community not found");
    }

    res.json(community);
  } catch (error) {
    next(error);
  }
};

// GET posts of a community by NAME
export const getCommunityPostsByName = async (req, res, next) => {
  try {
    const community = await Community.findOne({ name: req.params.name });
    
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const posts = await Post.find({ community: community._id, status: "published" })
      .populate("author", "username email avatar")
      .populate("community", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// UPDATE community (only creator)
export const updateCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    if (community.creator.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Only the creator can update this community");
    }

    community.name = req.body.name ?? community.name;
    community.description = req.body.description ?? community.description;

    await community.save();

    res.json(community);
  } catch (error) {
    next(error);
  }
};

// DELETE community (only creator)
export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    if (community.creator.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Only the creator can delete this community");
    }

    await community.deleteOne();

    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// JOIN community
export const joinCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isMember = community.members.some(
      (m) => m.toString() === userId
    );

    if (isMember) {
      throw new BadRequestError("Already a member");
    }

    community.members.push(req.user._id);
    await community.save();

    res.json({ message: "Joined community", community });
  } catch (error) {
    next(error);
  }
};

// LEAVE community
export const leaveCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isMember = community.members.some(
      (m) => m.toString() === userId
    );

    if (!isMember) {
      throw new BadRequestError("You are not a member");
    }

    community.members = community.members.filter(
      (m) => m.toString() !== userId
    );
    await community.save();

    res.json({ message: "Left community", community });
  } catch (error) {
    next(error);
  }
};

// GET posts of a community
export const getCommunityPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .populate("author", "username email")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// UPDATE community settings (icon, banner, description, name) - only creator/mods
export const updateCommunitySettings = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isCreator = community.creator.toString() === userId;
    const isMod = community.moderators?.some(m => m.toString() === userId);

    if (!isCreator && !isMod) {
      throw new ForbiddenError("Only the owner or moderators can update this community");
    }

    const { name, description, icon, banner, rules } = req.body;
    
    // Only owner can change the name
    if (name !== undefined && isCreator) {
      // Check for duplicate community name
      const existing = await Community.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: community._id }
      });
      if (existing) {
        throw new BadRequestError("Community name already exists");
      }
      community.name = name;
    }
    
    if (description !== undefined) community.description = description;
    if (icon !== undefined) community.icon = icon;
    if (banner !== undefined) community.banner = banner;
    if (rules !== undefined) community.rules = rules;

    await community.save();
    res.json(community);
  } catch (error) {
    next(error);
  }
};

// ADD moderator - only creator
export const addModerator = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    if (community.creator.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Only the owner can add moderators");
    }

    const { userId } = req.body;
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const isAlreadyMod = community.moderators?.some(m => m.toString() === userId);
    if (isAlreadyMod) {
      throw new BadRequestError("User is already a moderator");
    }

    community.moderators = community.moderators || [];
    community.moderators.push(userId);
    await community.save();

    const updatedCommunity = await Community.findById(req.params.id)
      .populate("moderators", "username avatar");

    res.json(updatedCommunity);
  } catch (error) {
    next(error);
  }
};

// REMOVE moderator - only creator
export const removeModerator = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    if (community.creator.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Only the owner can remove moderators");
    }

    const { userId } = req.body;
    community.moderators = community.moderators.filter(m => m.toString() !== userId);
    await community.save();

    res.json({ message: "Moderator removed", community });
  } catch (error) {
    next(error);
  }
};

// BAN user from community - only creator/mods
export const banUser = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isCreator = community.creator.toString() === userId;
    const isMod = community.moderators?.some(m => m.toString() === userId);

    if (!isCreator && !isMod) {
      throw new ForbiddenError("Only the owner or moderators can ban users");
    }

    const { userId: banUserId } = req.body;
    if (!banUserId) {
      throw new BadRequestError("User ID is required");
    }

    // Can't ban the creator
    if (banUserId === community.creator.toString()) {
      throw new BadRequestError("Cannot ban the community owner");
    }

    // Can't ban other moderators unless you're the creator
    const targetIsMod = community.moderators?.some(m => m.toString() === banUserId);
    if (targetIsMod && !isCreator) {
      throw new ForbiddenError("Only the owner can ban moderators");
    }

    community.bannedUsers = community.bannedUsers || [];
    if (!community.bannedUsers.some(b => b.toString() === banUserId)) {
      community.bannedUsers.push(banUserId);
    }

    // Remove from members
    community.members = community.members.filter(m => m.toString() !== banUserId);
    // Remove from moderators if applicable
    community.moderators = community.moderators.filter(m => m.toString() !== banUserId);

    await community.save();
    res.json({ message: "User banned", community });
  } catch (error) {
    next(error);
  }
};

// UNBAN user - only creator/mods
export const unbanUser = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isCreator = community.creator.toString() === userId;
    const isMod = community.moderators?.some(m => m.toString() === userId);

    if (!isCreator && !isMod) {
      throw new ForbiddenError("Only the owner or moderators can unban users");
    }

    const { userId: unbanUserId } = req.body;
    community.bannedUsers = community.bannedUsers.filter(b => b.toString() !== unbanUserId);
    await community.save();

    res.json({ message: "User unbanned", community });
  } catch (error) {
    next(error);
  }
};

// REMOVE member from community - only creator/mods
export const removeMember = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isCreator = community.creator.toString() === userId;
    const isMod = community.moderators?.some(m => m.toString() === userId);

    if (!isCreator && !isMod) {
      throw new ForbiddenError("Only the owner or moderators can remove members");
    }

    const { userId: removeUserId } = req.body;
    
    // Can't remove the creator
    if (removeUserId === community.creator.toString()) {
      throw new BadRequestError("Cannot remove the community owner");
    }

    community.members = community.members.filter(m => m.toString() !== removeUserId);
    await community.save();

    res.json({ message: "Member removed", community });
  } catch (error) {
    next(error);
  }
};

// GET community members
export const getCommunityMembers = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("members", "username avatar email")
      .populate("moderators", "username avatar")
      .populate("bannedUsers", "username avatar")
      .populate("creator", "username avatar");

    if (!community) {
      throw new NotFoundError("Community not found");
    }

    res.json({
      members: community.members,
      moderators: community.moderators || [],
      bannedUsers: community.bannedUsers || [],
      creator: community.creator
    });
  } catch (error) {
    next(error);
  }
};

// DELETE post from community - only creator/mods
export const deletePostFromCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new NotFoundError("Community not found");
    }

    const userId = req.user._id.toString();
    const isCreator = community.creator.toString() === userId;
    const isMod = community.moderators?.some(m => m.toString() === userId);

    if (!isCreator && !isMod) {
      throw new ForbiddenError("Only the owner or moderators can delete posts");
    }

    const { postId } = req.params;
    
    // Remove post from community
    community.posts = community.posts.filter(p => p.toString() !== postId);
    await community.save();

    // Delete the post itself
    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

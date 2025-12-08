import Community from "../models/Community.js";
import Post from "../models/Post.js";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";


// CREATE community
export const createCommunity = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new BadRequestError("Community name is required");
    }

    const existing = await Community.findOne({ name });
    if (existing) {
      throw new BadRequestError("Community already exists");
    }

    const creator = req.user._id;

    const community = await Community.create({
      name,
      description,
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

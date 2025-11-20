import Community from "../models/Community.js";
import Post from "../models/Post.js";

// CREATE community
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Community name is required" });
    }

    const existing = await Community.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Community already exists" });
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
    res.status(500).json({ message: error.message });
  }
};

// READ all communities
export const getAllCommunities = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// READ one community by ID
export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator", "username email")
      .populate("members", "username")
      .populate({
        path: "posts",
        select: "title author createdAt",
        populate: { path: "author", select: "username" },
      });

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE community (only creator)
export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the creator can update this community" });
    }

    community.name = req.body.name ?? community.name;
    community.description = req.body.description ?? community.description;
    await community.save();

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE community (only creator)
export const deleteCommunity = async (req, res) => {
  try{
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this community" });
    }

    await community.deleteOne();

    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// JOIN community
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    const userId = req.user._id.toString();
    const isMember = community.members.some(
      (m) => m.toString() === userId
    );

    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    community.members.push(req.user._id);
    await community.save();

    res.json({ message: "Joined community", community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LEAVE community
export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    const userId = req.user._id.toString();
    const isMember = community.members.some(
      (m) => m.toString() === userId
    );

    if (!isMember) {
      return res.status(400).json({ message: "You are not a member" });
    }

    community.members = community.members.filter(
      (m) => m.toString() !== userId
    );

    await community.save();

    res.json({ message: "Left community", community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET posts of a community
export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .populate("author", "username email")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

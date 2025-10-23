import Community from "../models/Community.js";

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

    // 👇 Automatically use the logged-in user as the creator
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
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE community
export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE community
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

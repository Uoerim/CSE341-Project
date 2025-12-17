import User from "../models/User.js";
import Community from "../models/Community.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";


// GET all users (no password)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// CREATE user (no token, probably for seeding/admin)
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new BadRequestError("Username, email, and password are required");
    }

    const user = await User.create({ username, email, password });
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json(safeUser);
  } catch (err) {
    next(err);
  }
};

// GET user by id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET my profile (from req.user)
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE my profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

// SEARCH users + communities
export const searchUsersAndCommunities = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i");

    if (!q.trim()) {
      throw new BadRequestError("Search query is required");
    }

    const users = await User.find({ username: regex }).select(
      "username email avatar"
    );

    const communities = await Community.find({ name: regex }).select(
      "name description"
    );

    res.json({ users, communities });
  } catch (err) {
    next(err);
  }
};

// PUBLIC PROFILE ENDPOINTS BY USERNAME
const calcScore = (docs) => 
  docs.reduce(
    (sum, d) => sum + d.upvotes.length - d.downvotes.length, 0
  );

// GET public profule header + stats by username
export const getUserProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const [posts, comments] = await Promise.all([
      Post.find({ author: user._id }).select("upvotes downvotes"),
      Comment.find({ author: user._id }).select("upvotes downvotes"),
    ]);

    const postKarma = calcScore(posts);
    const commentKarma = calcScore(comments);
    const totalKarma = postKarma + commentKarma;

    res.json({
      user,
      stats: {
        postKarma, commentKarma, totalKarma, postCount: posts.length, commentCount: comments.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

//GET posts for username/posts
export const getUserPostsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const posts = await Post.find({
      author: user._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("community", "name")
      .populate("author", "username avatar")
      .lean();

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// GET comments for username/comments
export const getUserCommentsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const comments = await Comment.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("post", "title community")
      .populate("author", "username avatar")
      .lean();

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// GET overview (mixed posts + comments) for username/overview
export const getUserOverviewByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const [posts, comments] = await Promise.all([
      Post.find({
        author: user._id,
        status: "published",
      })
        .sort({ createdAt: -1 })
        .populate("community", "name")
        .populate("author", "username avatar")
        .lean(),
      Comment.find({ author: user._id })
        .sort({ createdAt: -1 })
        .populate("post", "title community")
        .populate("author", "username avatar")
        .lean(),
    ]);

    const items = [
      ...posts.map((p) => ({
        type: "post",
        createdAt: p.createdAt,
        data: p,
      })),
      ...comments.map((c) => ({
        type: "comment",
        createdAt: c.createdAt,
        data: c,
      })),
    ].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET upvoted posts for username/upvoted
export const getUserUpvotedByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const posts = await Post.find({
      upvotes: user._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("community", "name")
      .populate("author", "username avatar")
      .lean();

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// GET downvoted posts for username/downvoted
export const getUserDownvotedByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const posts = await Post.find({
      downvotes: user._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("community", "name")
      .populate("author", "username avatar")
      .lean();

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// GET saved posts for username/saved (placeholder - returns empty for now)
export const getUserSavedByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id savedPosts");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If user has savedPosts field, fetch them; otherwise return empty array
    if (user.savedPosts && user.savedPosts.length > 0) {
      const posts = await Post.find({
        _id: { $in: user.savedPosts },
        status: "published",
      })
        .sort({ createdAt: -1 })
        .populate("community", "name")
        .populate("author", "username avatar")
        .lean();

      res.json(posts);
    } else {
      res.json([]);
    }
  } catch (err) {
    next(err);
  }
};

// GET history posts for username/history (placeholder - returns empty for now)
export const getUserHistoryByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id viewHistory");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If user has viewHistory field, fetch them; otherwise return empty array
    if (user.viewHistory && user.viewHistory.length > 0) {
      const posts = await Post.find({
        _id: { $in: user.viewHistory },
        status: "published",
      })
        .sort({ createdAt: -1 })
        .populate("community", "name")
        .populate("author", "username avatar")
        .lean();

      res.json(posts);
    } else {
      res.json([]);
    }
  } catch (err) {
    next(err);
  }
};

// GET hidden posts for username/hidden (placeholder - returns empty for now)
export const getUserHiddenByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id hiddenPosts");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If user has hiddenPosts field, fetch them; otherwise return empty array
    if (user.hiddenPosts && user.hiddenPosts.length > 0) {
      const posts = await Post.find({
        _id: { $in: user.hiddenPosts },
        status: "published",
      })
        .sort({ createdAt: -1 })
        .populate("community", "name")
        .populate("author", "username avatar")
        .lean();

      res.json(posts);
    } else {
      res.json([]);
    }
  } catch (err) {
    next(err);
  }
};
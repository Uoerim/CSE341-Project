import User from "../models/User.js";
import Community from "../models/Community.js";
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

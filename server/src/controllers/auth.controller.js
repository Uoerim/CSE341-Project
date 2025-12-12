import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { BadRequestError, ConflictError, UnauthorizedError} from "../utils/httpErrors.js";
import { verifyGoogleIdToken } from "../utils/googleAuth.js";

// Helper to create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "999y", // Token stays valid for 999 years
  });
};

// REGISTER user
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !email || !password) {
      throw new BadRequestError("All fields are required");
    }

    if (username.length < 4) {
      throw new BadRequestError("Username must be at least 4 characters");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ConflictError("User already exists");
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ConflictError("Username already taken");
    }

    const user = await User.create({
      username,
      email,
      password,
      gender: gender || "prefer not to say",
      bio: "",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN user
export const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      throw new BadRequestError("Invalid username or password.");
    }

    // Find user by either email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid username or password.");
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// CHECK username availability
export const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      throw new BadRequestError("Username is required");
    }

    if (username.length < 4) {
      throw new BadRequestError("Username must be at least 4 characters");
    }

    const userExists = await User.findOne({ username });
    res.json({ exists: !!userExists });
  } catch (error) {
    next(error);
  }
};

// CHECK email availability
export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    const userExists = await User.findOne({ email });
    res.json({ exists: !!userExists });
  } catch (error) {
    next(error);
  }
};

// VERIFY token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    res.json({
      valid: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        gender: user.gender,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    // jwt.verify can throw errors; treat as unauthorized unless it is already HttpError
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired token"));
    }
    next(error);
  }
};

// GOOGLE SIGN-IN authentication
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Verify the Google ID token
    let googleUser;
    try {
      googleUser = await verifyGoogleIdToken(idToken);
    } catch (error) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // User exists, return login response
      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        isNewUser: false,
      });
    } else {
      // User doesn't exist, return that they need to register
      return res.json({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.sub,
        isNewUser: true,
        message: "User needs to complete registration",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// COMPLETE GOOGLE REGISTRATION (second stage)
export const completeGoogleRegistration = async (req, res) => {
  try {
    const { idToken, username, gender } = req.body;

    if (!idToken || !username) {
      return res.status(400).json({ message: "ID token and username are required" });
    }

    // Verify the Google ID token again
    let googleUser;
    try {
      googleUser = await verifyGoogleIdToken(idToken);
    } catch (error) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: googleUser.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if username is taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create new user with Google information
    const user = await User.create({
      username,
      email: googleUser.email,
      password: generateSecurePassword(), // Generate a secure password for Google users
      gender: gender || "prefer not to say",
      avatar: googleUser.picture || "",
      bio: ""
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate a secure random password for Google users
function generateSecurePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 32; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UnauthorizedError } from "../utils/httpErrors.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new UnauthorizedError("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      throw new UnauthorizedError("Not authorized, user not found");
    }

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new UnauthorizedError("Not authorized, token failed"));
    }
    next(error);
  }
};

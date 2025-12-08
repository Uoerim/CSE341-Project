import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import communityRoutes from "./routes/community.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import searchRoutes from "./routes/search.routes.js";

import { protect } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes (protected)
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/communities", protect, communityRoutes);
app.use("/api/posts", protect, postRoutes);
app.use("/api/comments", protect, commentRoutes);
app.use("/api/search", searchRoutes);


// Health check route
app.get("/health", (req, res) => res.json({ status: "OK", message: "Backend running fine 🚀" }));

// Global error handler
app.use(errorHandler);

export default app;

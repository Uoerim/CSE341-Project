import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import communityRoutes from "./routes/community.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import searchRoutes from "./routes/search.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import exploreRoutes from "./routes/explore.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { protect } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/communities", protect, communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);  // Individual routes handle their own auth
app.use("/api/search", searchRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

// Health check route
app.get("/health", (req, res) => res.json({ status: "OK", message: "Backend running fine 🚀" }));

// Global error handler
app.use(errorHandler);

export default app;

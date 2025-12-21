import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import "./models/User.js";
import "./models/Community.js";
import "./models/Post.js"; // optional, but good for order


dotenv.config(); // must be called before accessing process.env

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their userId
  socket.on("user:join", (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle sending messages
  socket.on("chat:message", (data) => {
    const { recipientId, message, chatId } = data;
    const recipientSocketId = connectedUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("chat:message", {
        chatId,
        message
      });
    }
  });

  // Handle typing indicator
  socket.on("chat:typing", (data) => {
    const { recipientId, chatId, isTyping } = data;
    const recipientSocketId = connectedUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("chat:typing", {
        chatId,
        isTyping,
        userId: socket.userId
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
    }
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);
app.set("connectedUsers", connectedUsers);

// Connect to MongoDB first
connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});

import dotenv from "dotenv";
import "./models/User.js";
import "./models/Community.js";
import "./models/Post.js"; // optional, but good for order


dotenv.config(); // must be called before accessing process.env

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});

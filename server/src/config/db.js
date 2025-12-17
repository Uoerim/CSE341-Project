import mongoose from "mongoose";
import { initGridFS } from "./gridfs.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`); // prints host
    
    // Initialize GridFS after connection is established
    initGridFS();
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`); // server stops
    process.exit(1);
  }
};

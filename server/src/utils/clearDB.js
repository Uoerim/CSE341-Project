import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await mongoose.connection.dropDatabase();
    console.log("🧹 Database cleared successfully!");

    await mongoose.connection.close();
    console.log("🔒 Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing DB:", error);
    process.exit(1);
  }
};

clearDB();



// node src/utils/clearDB.js to run this file
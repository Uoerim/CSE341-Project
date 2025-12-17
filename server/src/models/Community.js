import express from "express";
import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["public", "restricted", "private", "mature"],
    default: "public",
  },
  topics: [{
    type: String,
  }],
  banner: {
    type: String, // GridFS file ID
  },
  icon: {
    type: String, // GridFS file ID
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Community", communitySchema);

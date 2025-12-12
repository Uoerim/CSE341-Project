import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// models/User.js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true, // allow null for phone-only accounts
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "prefer not to say"],
    default: "prefer not to say",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

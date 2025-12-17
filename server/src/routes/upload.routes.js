import express from "express";
import { uploadImage, getImage, deleteImage } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Upload single image
router.post("/image", protect, upload.single("image"), uploadImage);

// Get image by ID
router.get("/image/:id", getImage);

// Delete image by ID
router.delete("/image/:id", protect, deleteImage);

export default router;

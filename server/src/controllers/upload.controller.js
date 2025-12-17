import mongoose from "mongoose";
import { Readable } from "stream";
import { getGridFSBucket } from "../config/gridfs.js";
import { BadRequestError, NotFoundError } from "../utils/httpErrors.js";

// Upload image to GridFS
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const bucket = getGridFSBucket();
    
    // Create a readable stream from buffer
    const readableStream = Readable.from(req.file.buffer);
    
    // Create upload stream
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        uploadedBy: req.user._id,
        uploadedAt: new Date(),
      },
    });

    // Pipe file to GridFS
    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      res.status(201).json({
        success: true,
        fileId: uploadStream.id.toString(),
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        url: `/api/uploads/image/${uploadStream.id.toString()}`,
      });
    });

    uploadStream.on("error", (error) => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
};

// Get image from GridFS
export const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid file ID");
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    // Find file metadata
    const files = await bucket.find({ _id: objectId }).toArray();
    
    if (!files || files.length === 0) {
      throw new NotFoundError("File not found");
    }

    const file = files[0];

    // Set content type header
    res.set("Content-Type", file.contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Create download stream and pipe to response
    const downloadStream = bucket.openDownloadStream(objectId);
    
    downloadStream.on("error", (error) => {
      next(error);
    });

    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// Delete image from GridFS
export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid file ID");
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    // Check if file exists
    const files = await bucket.find({ _id: objectId }).toArray();
    
    if (!files || files.length === 0) {
      throw new NotFoundError("File not found");
    }

    // Delete the file
    await bucket.delete(objectId);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

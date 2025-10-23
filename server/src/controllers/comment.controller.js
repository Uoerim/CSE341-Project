import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// CREATE comment
export const createComment = async (req, res) => {
  try {
    const { content, post } = req.body;

    if (!content || !post) {
      return res.status(400).json({ message: "Content and post are required" });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post,
    });

    await Post.findByIdAndUpdate(post, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .populate("parentComment");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("author", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
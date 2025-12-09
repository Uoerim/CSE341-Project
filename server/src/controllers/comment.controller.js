import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";

// CREATE comment
export const createComment = async (req, res, next) => {
  try {
    const { content, post } = req.body;

    if (!content || !post) {
      throw new BadRequestError("Content and post are required");
    }

    const postDoc = await Post.findById(post);
    if (!postDoc) {
      throw new NotFoundError("Post not found");
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post,
    });

    postDoc.comments.push(comment._id);
    await postDoc.save();

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// READ comments for a post
export const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// UPDATE comment (only author)
export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not allowed to edit this comment");
    }

    if (content) comment.content = content;

    await comment.save();

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

// DELETE comment (only author)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not allowed to delete this comment");
    }

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all comments (for testing)
export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate("author", "username");
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

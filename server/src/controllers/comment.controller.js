import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";

// CREATE comment
export const createComment = async (req, res, next) => {
  try {
    const { content, post, parentComment } = req.body;

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
      parentComment: parentComment || null,
    });

    postDoc.comments.push(comment._id);
    await postDoc.save();

    // Populate author before returning
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username avatar");

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// READ comments for a post
export const getCommentsByPost = async (req, res, next) => {
  try {
    // First try to find comments by post field
    let comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 });

    // If no comments found, try to get from Post.comments array (fallback for old data)
    if (comments.length === 0) {
      const post = await Post.findById(req.params.postId).populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" }
      });
      
      if (post && post.comments) {
        comments = post.comments;
      }
    }

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// GET replies for a comment
export const getRepliesByComment = async (req, res, next) => {
  try {
    const replies = await Comment.find({ parentComment: req.params.commentId })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 });

    res.json(replies);
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

// UPVOTE comment (toggle)
export const upvoteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const userId = req.user._id.toString();

    if (comment.upvotes.map((u) => u.toString()).includes(userId)) {
      comment.upvotes.pull(req.user._id);
    } else {
      comment.upvotes.push(req.user._id);
      comment.downvotes.pull(req.user._id);
    }

    await comment.save();

    res.json({
      message: "Comment upvoted",
      upvotes: comment.upvotes.length,
      downvotes: comment.downvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// DOWNVOTE comment (toggle)
export const downvoteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const userId = req.user._id.toString();

    if (comment.downvotes.map((u) => u.toString()).includes(userId)) {
      comment.downvotes.pull(req.user._id);
    } else {
      comment.downvotes.push(req.user._id);
      comment.upvotes.pull(req.user._id);
    }

    await comment.save();

    res.json({
      message: "Comment downvoted",
      upvotes: comment.upvotes.length,
      downvotes: comment.downvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

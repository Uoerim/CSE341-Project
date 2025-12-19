import Post from "../models/Post.js";
import Community from "../models/Community.js";
import OpenAI from "openai";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";


const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const createPost = async (req, res, next) => {
  try {
    const { title, content, community, status } = req.body;

    if (!title || !title.trim()) {
      throw new BadRequestError("Title is required");
    }

    // Validate status if provided
    if (status && !["draft", "published"].includes(status)) {
      throw new BadRequestError("Status must be 'draft' or 'published'");
    }

    // If community is provided, validate it exists
    let communityDoc = null;
    if (community) {
      communityDoc = await Community.findById(community);
      if (!communityDoc) {
        throw new NotFoundError("Community not found");
      }
    }

    const author = req.user._id;

    const post = await Post.create({ 
      title, 
      content: content || "", // Allow empty content
      author, 
      community: community || null, 
      status: status || "published" 
    });

    // Only add to community if community was provided
    if (communityDoc) {
      communityDoc.posts.push(post._id);
      await communityDoc.save();
    }

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// READ all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// FEED posts (home page)
export const getFeedPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Convert exclude IDs to proper strings for comparison
    let excludeIds = [];
    if (req.query.exclude) {
      excludeIds = req.query.exclude.split(",").filter(id => id.trim());
    }

    // Get posts from last 30 days, exclude already loaded posts
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const query = {
      status: "published",
      createdAt: { $gte: thirtyDaysAgo }
    };

    // Add exclude filter only if there are IDs to exclude
    if (excludeIds.length > 0) {
      query._id = { $nin: excludeIds };
    }
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("author", "username avatar")
      .populate("community", "name")
      .lean();

    // Get total count for pagination info (excluding the already-loaded posts)
    const total = await Post.countDocuments(query);

    const hasMore = (skip + limit) < total;

    res.json({
      posts: posts.map(post => ({
        ...post,
        _id: post._id.toString() // Ensure _id is a string
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get recent posts for sidebar
export const getRecentPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username avatar")
      .populate("community", "name icon")
      .select("title content createdAt upvotes downvotes comments")
      .lean();

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// READ single post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email avatar")
      .populate("community", "name")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

// UPDATE post (only author)
export const updatePost = async (req, res, next) => {
  try {
    console.log("updatePost called with:", { id: req.params.id, body: req.body, userId: req.user._id });
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not allowed to edit this post");
    }

    // Update fields if provided
    if (req.body.title !== undefined) {
      post.title = req.body.title;
    }
    if (req.body.content !== undefined) {
      post.content = req.body.content;
    }
    if (req.body.status !== undefined) {
      post.status = req.body.status;
    }
    // Only update community if explicitly provided and not null
    if (req.body.community !== undefined && req.body.community !== null) {
      const communityDoc = await Community.findById(req.body.community);
      if (!communityDoc) {
        throw new NotFoundError("Community not found");
      }
      post.community = req.body.community;
    }

    await post.save();
    console.log("Post updated successfully:", post);

    res.json(post);
  } catch (error) {
    console.error("updatePost error:", error);
    next(error);
  }
};

// DELETE post (only author)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not allowed to delete this post");
    }

    await post.deleteOne();

    await Community.findByIdAndUpdate(post.community, {
      $pull: { posts: post._id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// UPVOTE post (toggle)
export const upvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const userId = req.user._id.toString();

    if (post.upvotes.map((u) => u.toString()).includes(userId)) {
      post.upvotes.pull(req.user._id);
    } else {
      post.upvotes.push(req.user._id);
      post.downvotes.pull(req.user._id);
    }

    await post.save();

    res.json({
      message: "Post upvoted",
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// DOWNVOTE post (toggle)
export const downvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const userId = req.user._id.toString();

    if (post.downvotes.map((u) => u.toString()).includes(userId)) {
      post.downvotes.pull(req.user._id);
    } else {
      post.downvotes.push(req.user._id);
      post.upvotes.pull(req.user._id);
    }

    await post.save();

    res.json({
      message: "Post downvoted",
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// SUMMARIZE post
export const summarizePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    let summary = null;

    const generateSummaryFromText = (title, content) => {
      const text = (content || "").toString().replace(/\s+/g, " ").trim();
      if (text.length) {
        const sentences = text.split(/(?<=[.!?])\s+/);
        let sentence =
          sentences.find((s) => s.trim().length > 20) || sentences[0] || text;
        sentence = sentence.trim();
        if (sentence.length > 120) {
          sentence = sentence.slice(0, 117).trim() + "...";
        }
        return sentence;
      }
      if (title && title.toString().trim().length) {
        return title.toString().trim();
      }
      return "";
    };

    const useAI =
      req.query.ai === "true" || req.query.useAI === "true";

    if (useAI && openaiClient) {
      try {
        const prompt = `Summarize this Reddit-style post in ONE clear sentence (max 60 words). Avoid emojis, fluff, and unnecessary details.\n\nTitle: ${post.title}\nContent: ${post.content || ""}`;

        const completion = await openaiClient.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 120,
          temperature: 0.2,
        });

        const aiText = completion?.choices?.[0]?.message?.content;
        if (aiText && aiText.toString().trim().length) {
          summary = aiText.toString().trim();
        }
      } catch (aiErr) {
        console.error("AI summarization failed:", aiErr?.message || aiErr);
        // fall through to local summarizer
      }
    }

    if (!summary) {
      summary = generateSummaryFromText(post.title, post.content);
    }

    if (!summary || summary.length === 0) {
      summary = post.content
        ? post.content.slice(0, 120) + "..."
        : post.title;
    }

    res.json({
      postId: post._id,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

// GET user's draft posts
export const getUserDrafts = async (req, res, next) => {
  try {
    const posts = await Post.find({ 
      author: req.user._id, 
      status: "draft" 
    })
      .populate("author", "username email")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};


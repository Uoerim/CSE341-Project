import Post from "../models/Post.js";
import Community from "../models/Community.js";
import OpenAI from "openai";
import { BadRequestError, ForbiddenError, NotFoundError} from "../utils/httpErrors.js";


const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// CREATE post
export const createPost = async (req, res, next) => {
  try {
    const { title, content, community, status } = req.body;

    if (!title || !title.trim()) {
      throw new BadRequestError("Title is required");
    }

    if (status === "published" && community && (!content || !content.trim())) {
      throw new BadRequestError("Post content is required");
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
      content, 
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

// TRENDING posts for carousel
export const getTrendingPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // Get hot posts from last 12 hours for trending
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const query = {
      status: "published",
      createdAt: { $gte: twelveHoursAgo }
    };

    let posts = await Post.find(query)
      .populate("author", "username avatar")
      .populate("community", "name")
      .lean();
    
    // Calculate trending score (velocity-based)
    posts = posts.map(post => {
      const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      const upvoteCount = post.upvotes ? post.upvotes.length : 0;
      const commentCount = post.comments ? post.comments.length : 0;
      const trendingScore = (upvoteCount * 2 + commentCount) / (ageInHours + 1);
      return { ...post, trendingScore };
    });
    
    // Sort by trending score and limit
    posts.sort((a, b) => b.trendingScore - a.trendingScore);
    posts = posts.slice(0, limit);

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

// POPULAR posts with Reddit-style sorting
export const getPopularPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "best";
    const timeFilter = req.query.time || "today";
    
    let excludeIds = [];
    if (req.query.exclude) {
      excludeIds = req.query.exclude.split(",").filter(id => id.trim());
    }

    const query = { status: "published" };
    
    if (excludeIds.length > 0) {
      query._id = { $nin: excludeIds };
    }

    // Apply time filter for top/hot
    if (sortBy === "top" || sortBy === "hot") {
      const now = new Date();
      let timeThreshold;
      
      switch (timeFilter) {
        case "now":
          timeThreshold = new Date(now - 1 * 60 * 60 * 1000);
          break;
        case "today":
          timeThreshold = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case "week":
          timeThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          timeThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          timeThreshold = new Date(now - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeThreshold = null;
      }
      
      if (timeThreshold) {
        query.createdAt = { $gte: timeThreshold };
      }
    }

    let posts;
    let sortOptions = {};

    switch (sortBy) {
      case "hot":
        posts = await Post.find(query)
          .populate("author", "username avatar")
          .populate("community", "name")
          .lean();
        
        posts = posts.map(post => {
          const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
          const upvoteCount = post.upvotes ? post.upvotes.length : 0;
          const downvoteCount = post.downvotes ? post.downvotes.length : 0;
          const score = (upvoteCount - downvoteCount) / Math.pow(ageInHours + 2, 1.5);
          return { ...post, hotScore: score };
        });
        
        posts.sort((a, b) => b.hotScore - a.hotScore);
        posts = posts.slice(skip, skip + limit);
        break;

      case "new":
        sortOptions = { createdAt: -1 };
        posts = await Post.find(query)
          .populate("author", "username avatar")
          .populate("community", "name")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean();
        break;

      case "top":
        posts = await Post.find(query)
          .populate("author", "username avatar")
          .populate("community", "name")
          .lean();
        
        // Sort by upvote count
        posts.sort((a, b) => {
          const aUpvotes = a.upvotes ? a.upvotes.length : 0;
          const bUpvotes = b.upvotes ? b.upvotes.length : 0;
          if (bUpvotes !== aUpvotes) return bUpvotes - aUpvotes;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        posts = posts.slice(skip, skip + limit);
        break;

      case "rising":
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: twentyFourHoursAgo };
        
        posts = await Post.find(query)
          .populate("author", "username avatar")
          .populate("community", "name")
          .lean();
        
        posts = posts.map(post => {
          const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
          const upvoteCount = post.upvotes ? post.upvotes.length : 0;
          const velocity = upvoteCount / (ageInHours + 1);
          return { ...post, risingScore: velocity };
        });
        
        posts.sort((a, b) => b.risingScore - a.risingScore);
        posts = posts.slice(skip, skip + limit);
        break;

      case "best":
      default:
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: sevenDaysAgo };
        
        posts = await Post.find(query)
          .populate("author", "username avatar")
          .populate("community", "name")
          .lean();
        
        posts = posts.map(post => {
          const ageInDays = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          const agePenalty = ageInDays * 0.5;
          const upvoteCount = post.upvotes ? post.upvotes.length : 0;
          const commentCount = post.comments ? post.comments.length : 0;
          const score = (upvoteCount * 0.7) + (commentCount * 0.3) - agePenalty;
          return { ...post, bestScore: score };
        });
        
        posts.sort((a, b) => b.bestScore - a.bestScore);
        posts = posts.slice(skip, skip + limit);
        break;
    }

    const total = await Post.countDocuments(query);
    const hasMore = skip + posts.length < total;

    res.json({
      posts,
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("Not allowed to edit this post");
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    await post.save();

    res.json(post);
  } catch (error) {
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

// SAVE post (toggle)
export const savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const postId = post._id.toString();
    const savedIndex = user.savedPosts.findIndex(id => id.toString() === postId);

    if (savedIndex > -1) {
      // Unsave - remove from array
      user.savedPosts.splice(savedIndex, 1);
      await user.save();
      return res.json({
        message: "Post unsaved",
        saved: false,
      });
    } else {
      // Save - add to array
      user.savedPosts.push(post._id);
      await user.save();
      return res.json({
        message: "Post saved",
        saved: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// HIDE post (toggle)
export const hidePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const postId = post._id.toString();
    const hiddenIndex = user.hiddenPosts.findIndex(id => id.toString() === postId);

    if (hiddenIndex > -1) {
      // Unhide - remove from array
      user.hiddenPosts.splice(hiddenIndex, 1);
      await user.save();
      return res.json({
        message: "Post unhidden",
        hidden: false,
      });
    } else {
      // Hide - add to array
      user.hiddenPosts.push(post._id);
      await user.save();
      return res.json({
        message: "Post hidden",
        hidden: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ADD to history (track post views)
export const addToHistory = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const postId = post._id.toString();
    
    // Remove if already in history (to avoid duplicates)
    user.history = user.history.filter(id => id.toString() !== postId);
    
    // Add to beginning of history (most recent first)
    user.history.unshift(post._id);
    
    // Keep only last 100 items in history
    if (user.history.length > 100) {
      user.history = user.history.slice(0, 100);
    }
    
    await user.save();
    
    return res.json({
      message: "Added to history",
      historyCount: user.history.length
    });
  } catch (error) {
    next(error);
  }
};


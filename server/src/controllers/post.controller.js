import Post from "../models/Post.js";
import Community from "../models/Community.js";
import OpenAI from "openai";

// Note: removed direct Google GenAI usage here to avoid runtime errors
// and leaking API keys. summarizePost supports optional AI summarization
// when `?ai=true` is provided. It prefers OpenAI when `OPENAI_API_KEY`
// is set; otherwise it falls back to a safe local summarizer.

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;


export const createPost = async (req, res) => {
  try {
    const { title, content, community } = req.body;

    if (!title || !community) {
      return res
        .status(400)
        .json({ message: "Title and community are required" });
    }

    const communityDoc = await Community.findById(community);
    if (!communityDoc) {
      return res.status(404).json({ message: "Community not found" });
    }

    const author = req.user._id;

    const post = await Post.create({ title, content, author, community });

    // push post into community.posts
    communityDoc.posts.push(post._id);
    await communityDoc.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FEED posts (home page)
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username email")
      .populate("community", "name");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("community", "name")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE post (only author)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE post (only author)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();

    // Optional: remove from community.posts array
    await Community.findByIdAndUpdate(post.community, {
      $pull: { posts: post._id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPVOTE post (toggle)
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const summarizePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let summary = null;

    // local summarizer — used as fallback or when AI is not requested
    const generateSummaryFromText = (title, content) => {
      const text = (content || "").toString().replace(/\s+/g, ' ').trim();
      if (text.length) {
        const sentences = text.split(/(?<=[.!?])\s+/);
        let sentence = sentences.find((s) => s.trim().length > 20) || sentences[0] || text;
        sentence = sentence.trim();
        if (sentence.length > 120) sentence = sentence.slice(0, 117).trim() + '...';
        return sentence;
      }
      if (title && title.toString().trim().length) return title.toString().trim();
      return '';
    };

    const useAI = (req.query.ai === 'true' || req.query.useAI === 'true');

    if (useAI && openaiClient) {
      try {
        const prompt = `Summarize this Reddit-style post in ONE clear sentence (max 60 words). Avoid emojis, fluff, and unnecessary details.\n\nTitle: ${post.title}\nContent: ${post.content || ""}`;

        const completion = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 120,
          temperature: 0.2,
        });

        const aiText = completion?.choices?.[0]?.message?.content;
        if (aiText && aiText.toString().trim().length) {
          summary = aiText.toString().trim();
        }
      } catch (aiErr) {
        console.error('AI summarization failed:', aiErr?.message || aiErr);
        // fall through to local summarizer
      }
    }

    if (!summary) {
      summary = generateSummaryFromText(post.title, post.content);
    }

    // fallback
    if (!summary || summary.length === 0) {
      summary = post.content
        ? post.content.slice(0, 120) + "..."
        : post.title;
    }

    return res.json({
      postId: post._id,
      summary,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


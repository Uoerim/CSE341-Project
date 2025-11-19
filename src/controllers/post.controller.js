import Post from "../models/Post.js";
import Community from "../models/Community.js";

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

// frontend would call: POST /api/posts/:id/summarize (yousef ibrahim etfadal)
export const summarizePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const fallbackContent = post.content || post.title || "No content";
    let summary = null;

    if (openaiApiKey && typeof fetch === "function") {
      try {
        const prompt = `Summarize this Reddit-style post in one concise sentence (max 60 words).\\n\\nTitle: ${post.title}\\n\\nContent:\\n${post.content || ""}`;
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You summarize posts into one short, direct sentence. Avoid fluff.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 80,
            temperature: 0.3,
          }),
        });

        if (!aiRes.ok) {
          throw new Error(`OpenAI HTTP ${aiRes.status}`);
        }

        const aiData = await aiRes.json();
        summary = aiData?.choices?.[0]?.message?.content?.trim() || null;
      } catch (err) {
        console.error("AI summarization failed:", err.message);
      }
    }

    if (!summary) {
      summary =
        fallbackContent.length > 150
          ? fallbackContent.slice(0, 150) + "..."
          : fallbackContent;
    }

    res.json({
      postId: post._id,
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

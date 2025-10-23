import Post from "../models/Post.js";
import Community from "../models/Community.js"; 

// CREATE a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, community } = req.body;

    if (!title || !community) {
      return res.status(400).json({ message: "Title and community are required" });
    }

    const author = req.user._id;

    const post = await Post.create({ title, content, author, community });
    await Community.findByIdAndUpdate(
      community,
      { $push: { posts: post._id } },
      { new: true }
    );
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
      .populate("community", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // if user already upvoted, remove it (toggle)
    if (post.upvotes.includes(req.user._id)) {
      post.upvotes.pull(req.user._id);
    } else {
      post.upvotes.push(req.user._id);
      post.downvotes.pull(req.user._id); // remove from downvotes if exists
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

// ✅ DOWNVOTE
export const downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // if user already downvoted, remove it (toggle)
    if (post.downvotes.includes(req.user._id)) {
      post.downvotes.pull(req.user._id);
    } else {
      post.downvotes.push(req.user._id);
      post.upvotes.pull(req.user._id); // remove from upvotes if exists
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
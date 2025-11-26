import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const loadPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to load post", err);
    }
  };

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      // assumes POST /api/comments/:postId
      await api.post(`/comments/${postId}`, { content: newComment });
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleSummarize = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.post(`/posts/${postId}/summarize`);
      setSummary(res.data.summary || "");
    } catch (err) {
      console.error("Failed to summarize", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

      <button onClick={handleSummarize} disabled={loadingSummary}>
        {loadingSummary ? "Summarizing..." : "Summarize with AI"}
      </button>

      {summary && (
        <div
          style={{
            marginTop: 12,
            padding: 8,
            borderLeft: "4px solid #999",
            background: "#f8f8f8",
          }}
        >
          <strong>Summary:</strong> {summary}
        </div>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h3>Comments</h3>
      <form onSubmit={handleAddComment} style={{ marginBottom: 12 }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 8 }}
          placeholder="What are your thoughts?"
        />
        <button type="submit" style={{ marginTop: 4 }}>
          Comment
        </button>
      </form>

      {comments.map((c) => (
        <div
          key={c._id}
          style={{
            borderTop: "1px solid #eee",
            padding: "6px 0",
            fontSize: 14,
          }}
        >
          <div style={{ color: "#555", marginBottom: 2 }}>
            {c.author?.username ? `u/${c.author.username}` : "user"} ·{" "}
            {new Date(c.createdAt).toLocaleString()}
          </div>
          <div>{c.content}</div>
        </div>
      ))}
    </div>
  );
}

export default PostPage;

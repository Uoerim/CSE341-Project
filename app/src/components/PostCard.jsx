import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post, onUpvote, onDownvote, showCommunity = false }) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: "8px 12px",
        marginBottom: 12,
        display: "flex",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <button onClick={onUpvote}>⬆</button>
        <span>{(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}</span>
        <button onClick={onDownvote}>⬇</button>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
          {showCommunity && post.community && (
            <>
              <Link to={`/r/${post.community._id || post.community}`}>
                r/{post.community.name || "community"}
              </Link>{" "}
              •{" "}
            </>
          )}
          Posted by{" "}
          {post.author?.username
            ? `u/${post.author.username}`
            : "unknown"}{" "}
          · {new Date(post.createdAt).toLocaleString()}
        </div>

        <Link
          to={`/post/${post._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3 style={{ margin: "0 0 4px 0" }}>{post.title}</h3>
          {post.content && (
            <p style={{ margin: 0, fontSize: 14, color: "#222" }}>
              {post.content.slice(0, 160)}
              {post.content.length > 160 ? "..." : ""}
            </p>
          )}
        </Link>
      </div>
    </article>
  );
}

export default PostCard;

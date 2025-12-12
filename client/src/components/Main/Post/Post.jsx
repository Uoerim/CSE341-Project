// client/src/components/Main/Post/Post.jsx
import "./Post.css";

function Post({ post }) {
  return (
    <div className="post">
      <div className="post-vote-column">
        <button className="vote-button upvote">▲</button>
        <div className="vote-count">{post.votes}</div>
        <button className="vote-button downvote">▼</button>
      </div>

      <div className="post-main">
        <div className="post-meta">
          <span className="post-community">{post.community}</span>
          <span className="post-dot">•</span>
          <span className="post-author">Posted by {post.author}</span>
          <span className="post-dot">•</span>
          <span className="post-time">{post.createdAt}</span>
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-body">{post.body}</p>

        <div className="post-actions">
          <button className="post-action-button">
            💬 {post.comments} Comments
          </button>
          <button className="post-action-button">🔗 Share</button>
          <button className="post-action-button">💾 Save</button>
          <button className="post-action-button">⋯</button>
        </div>
      </div>
    </div>
  );
}

export default Post;

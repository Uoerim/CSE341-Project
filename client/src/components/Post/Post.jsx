import React, { useState } from "react";
import "./post.css";

function Post({ post, onPostClick }) {
    const [votes, setVotes] = useState({
        upvotes: post.upvotes?.length || 0,
        downvotes: post.downvotes?.length || 0,
    });

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return postDate.toLocaleDateString();
    };

    const extractFirstImage = (html) => {
        if (!html) return null;
        const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
        return imgMatch ? imgMatch[1] : null;
    };

    const firstImage = extractFirstImage(post.content);
    const voteCount = votes.upvotes - votes.downvotes;

    const handleVoteClick = (e, type) => {
        e.stopPropagation();
        // Vote logic here
    };

    const handleJoinClick = (e) => {
        e.stopPropagation();
        // Join logic here
    };

    const handleMoreClick = (e) => {
        e.stopPropagation();
        // More options logic here
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        // Share logic here
    };

    return (
        <div className="post-card" onClick={() => onPostClick(post._id)}>
            {/* Header Row */}
            <div className="post-header-row">
                <div className="post-community-info">
                    <div className="post-community-icon">
                        <img 
                            src={`/character/${post.author?.avatar || 'char'}.png`} 
                            alt={post.author?.username} 
                        />
                    </div>
                    <span className="post-subreddit">
                        u/{post.author?.username || "user"}
                    </span>
                    <span className="post-header-dot">•</span>
                    <span className="post-timestamp">{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-header-actions">
                    <button className="more-btn" onClick={handleMoreClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Post Title */}
            <h2 className="post-title">{post.title}</h2>

            {/* Post Image */}
            {firstImage && (
                <div className="post-image-container">
                    <img 
                        src={firstImage} 
                        alt="Post content" 
                        className="post-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Action Bar */}
            <div className="post-actions-bar">
                <div className="vote-pill">
                    <button 
                        className="vote-btn upvote" 
                        onClick={(e) => handleVoteClick(e, 'up')}
                    >
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
                        </svg>
                    </button>
                    <span className="vote-count">{voteCount}</span>
                    <button 
                        className="vote-btn downvote" 
                        onClick={(e) => handleVoteClick(e, 'down')}
                    >
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z"></path>
                        </svg>
                    </button>
                </div>

                <button className="action-pill">
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                    </svg>
                    <span>{post.comments?.length || 0}</span>
                </button>

                <button className="action-pill share-btn" onClick={handleShareClick}>
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8 17.524l6.89-6.887a.9.9 0 000-1.273L12.8 2.477a1.64 1.64 0 00-1.782-.349 1.64 1.64 0 00-1.014 1.518v2.593C4.054 6.728 1.192 12.075 1 17.376a1.353 1.353 0 00.862 1.32 1.35 1.35 0 001.531-.364l.334-.381c1.705-1.944 3.323-3.791 6.277-4.103v2.509c0 .667.398 1.262 1.014 1.518a1.638 1.638 0 001.783-.349v-.002zm-.994-1.548V12h-.9c-3.969 0-6.162 2.1-8.001 4.161.514-4.011 2.823-8.16 8-8.16h.9V4.024L17.784 10l-5.977 5.976z"></path>
                    </svg>
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
}

export default Post;

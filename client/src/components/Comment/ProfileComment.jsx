import React, { useState } from "react";
import "./profileComment.css";
import axios from "axios";

function ProfileComment({ comment }) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    // Get initial vote state
    const getUserVoteState = () => {
        if (!userId) return null;
        if (comment.upvotes?.includes(userId)) return 'up';
        if (comment.downvotes?.includes(userId)) return 'down';
        return null;
    };

    const [votes, setVotes] = useState({
        upvotes: comment.upvotes?.length || 0,
        downvotes: comment.downvotes?.length || 0,
    });
    const [userVote, setUserVote] = useState(getUserVoteState());
    const [isVoting, setIsVoting] = useState(false);

    const formatDate = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diffMs = now - commentDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffMins < 60) return `${diffMins} min. ago`;
        if (diffHours < 24) return `${diffHours} hr. ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffMonths < 12) return `${diffMonths} mo. ago`;
        return `${diffYears} yr. ago`;
    };

    const voteCount = votes.upvotes - votes.downvotes;

    const handleVoteClick = async (e, type) => {
        e.stopPropagation();
        
        if (!token) {
            alert("Please log in to vote");
            return;
        }
        
        if (isVoting) return;
        
        try {
            setIsVoting(true);
            const endpoint = type === 'up' ? 'upvote' : 'downvote';
            const response = await axios.put(
                `${apiUrl}/comments/${comment._id}/${endpoint}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setVotes({
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
            });
            
            if (type === 'up') {
                setUserVote(userVote === 'up' ? null : 'up');
            } else {
                setUserVote(userVote === 'down' ? null : 'down');
            }
        } catch (err) {
            console.error("Error voting:", err);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="profile-comment-card">
            {/* Header Row */}
            <div className="profile-comment-header">
                <div className="profile-comment-community">
                    {comment.post?.community?.icon ? (
                        <img 
                            src={comment.post.community.icon} 
                            alt="" 
                            className="profile-comment-community-icon"
                        />
                    ) : (
                        <div className="profile-comment-community-icon-placeholder">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806v6.527c-2.966-.076-5.556-2.66-5.556-5.951a5.81 5.81 0 0 1 9.489-4.488l-3.733 3.107Zm2.024 3.227 3.733-3.107a5.754 5.754 0 0 1 .49 2.262c0 3.275-2.554 5.875-5.463 5.951V9.561a1.616 1.616 0 0 0-.76-2.701Z" />
                            </svg>
                        </div>
                    )}
                    <span className="profile-comment-subreddit">
                        r/{comment.post?.community?.name || "community"}
                    </span>
                    <span className="profile-comment-dot">•</span>
                    <span className="profile-comment-post-title">
                        {comment.post?.title || "[deleted]"}
                    </span>
                </div>
            </div>

            {/* Author Row */}
            <div className="profile-comment-author-row">
                <img 
                    src={`/character/${comment.author?.avatar || 'char'}.png`} 
                    alt="" 
                    className="profile-comment-author-avatar"
                />
                <span className="profile-comment-author-name">
                    {comment.author?.username || "user"}
                </span>
                <span className="profile-comment-time">
                    commented {formatDate(comment.createdAt)}
                </span>
            </div>

            {/* Comment Content */}
            <div className="profile-comment-content">
                <p>{comment.content}</p>
            </div>

            {/* Action Bar */}
            <div className="profile-comment-actions">
                <div className={`profile-comment-vote-pill ${userVote ? 'voted' : ''}`}>
                    <button 
                        className={`profile-comment-vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
                        onClick={(e) => handleVoteClick(e, 'up')}
                        disabled={isVoting}
                    >
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
                        </svg>
                    </button>
                    <span className={`profile-comment-vote-count ${userVote === 'up' ? 'upvoted' : ''} ${userVote === 'down' ? 'downvoted' : ''}`}>
                        {voteCount}
                    </span>
                    <button 
                        className={`profile-comment-vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
                        onClick={(e) => handleVoteClick(e, 'down')}
                        disabled={isVoting}
                    >
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z"></path>
                        </svg>
                    </button>
                </div>

                <button className="profile-comment-action-btn">
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                    </svg>
                    <span>Reply</span>
                </button>

                <button className="profile-comment-action-btn">
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8 17.524l6.89-6.887a.9.9 0 000-1.273L12.8 2.477a1.64 1.64 0 00-1.782-.349 1.64 1.64 0 00-1.014 1.518v2.593C4.054 6.728 1.192 12.075 1 17.376a1.353 1.353 0 00.862 1.32 1.35 1.35 0 001.531-.364l.334-.381c1.705-1.944 3.323-3.791 6.277-4.103v2.509c0 .667.398 1.262 1.014 1.518a1.638 1.638 0 001.783-.349v-.002zm-.994-1.548V12h-.9c-3.969 0-6.162 2.1-8.001 4.161.514-4.011 2.823-8.16 8-8.16h.9V4.024L17.784 10l-5.977 5.976z"></path>
                    </svg>
                    <span>Share</span>
                </button>

                <button className="profile-comment-action-btn profile-comment-more-btn">
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ProfileComment;

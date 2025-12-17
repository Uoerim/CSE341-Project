import React, { useState } from "react";
import "./post.css";
import axios from "axios";

function Post({ post, onPostClick }) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    // Get initial vote state
    const getUserVoteState = () => {
        if (!userId) return null;
        if (post.upvotes?.includes(userId)) return 'up';
        if (post.downvotes?.includes(userId)) return 'down';
        return null;
    };

    const [votes, setVotes] = useState({
        upvotes: post.upvotes?.length || 0,
        downvotes: post.downvotes?.length || 0,
    });
    const [userVote, setUserVote] = useState(getUserVoteState());
    const [isVoting, setIsVoting] = useState(false);

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

    const extractAllImages = (html) => {
        if (!html) return [];
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
        const images = [];
        let match;
        while ((match = imgRegex.exec(html)) !== null) {
            images.push(match[1]);
        }
        return images;
    };

    const images = extractAllImages(post.content);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const voteCount = votes.upvotes - votes.downvotes;

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

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
                `${apiUrl}/posts/${post._id}/${endpoint}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setVotes({
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
            });
            
            // Update user vote state
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

    const handleJoinClick = (e) => {
        e.stopPropagation();
        // Join logic here
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
                    {post.community ? (
                        <>
                            <div className="post-community-icon">
                                <div className="community-icon-placeholder">
                                    r/
                                </div>
                            </div>
                            <div className="post-community-details">
                                <span className="post-community-name">r/{post.community.name}</span>
                                <div className="post-author-row">
                                    <span className="post-author">u/{post.author?.username || "user"}</span>
                                    <span className="post-header-dot">•</span>
                                    <span className="post-timestamp">{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {/* Post Title */}
            <h2 className="post-title">{post.title}</h2>

            {/* Post Image Carousel */}
            {images.length > 0 && (
                <div className="post-image-container">
                    <div className="post-image-blur-bg" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}></div>
                    <img 
                        src={images[currentImageIndex]} 
                        alt="Post content" 
                        className="post-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    {images.length > 1 && (
                        <>
                            <button className="post-image-nav prev" onClick={handlePrevImage}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                </svg>
                            </button>
                            <button className="post-image-nav next" onClick={handleNextImage}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                </svg>
                            </button>
                            <div className="post-image-dots">
                                {images.map((_, index) => (
                                    <span 
                                        key={index} 
                                        className={`post-image-dot ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    ></span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Action Bar */}
            <div className="post-actions-bar">
                <div className={`vote-pill ${userVote ? 'voted' : ''}`}>
                    <button 
                        className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
                        onClick={(e) => handleVoteClick(e, 'up')}
                        disabled={isVoting}
                    >
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
                        </svg>
                    </button>
                    <span className={`vote-count ${userVote === 'up' ? 'upvoted' : ''} ${userVote === 'down' ? 'downvoted' : ''}`}>{voteCount}</span>
                    <button 
                        className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
                        onClick={(e) => handleVoteClick(e, 'down')}
                        disabled={isVoting}
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

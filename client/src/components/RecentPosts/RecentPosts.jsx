import React, { useState, useEffect } from "react";
import "./recentPosts.css";
import axios from "axios";

function RecentPosts({ onPostClick }) {
    const [recentPosts, setRecentPosts] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetchRecentPosts();
    }, []);

    const fetchRecentPosts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/posts/recent?limit=5`);
            setRecentPosts(response.data);
        } catch (error) {
            console.error("Error fetching recent posts:", error);
        }
    };

    const handleClear = () => {
        setRecentPosts([]);
    };

    const extractFirstImage = (html) => {
        if (!html) return null;
        const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
        return imgMatch ? imgMatch[1] : null;
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

    const formatTime = (date) => {
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

    if (recentPosts.length === 0) return null;

    return (
        <div className="recent-posts-widget">
            <div className="recent-posts-header">
                <h3>RECENT POSTS</h3>
                <button className="recent-posts-clear" onClick={handleClear}>
                    Clear
                </button>
            </div>
            <div className="recent-posts-list">
                {recentPosts.map((post) => {
                    const images = extractAllImages(post.content);
                    const thumbnail = images[0];
                    const voteCount = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
                    const commentCount = post.comments?.length || 0;

                    return (
                        <div 
                            key={post._id} 
                            className="recent-post-item"
                            onClick={() => onPostClick(post._id)}
                        >
                            <div className="recent-post-content">
                                <div className="recent-post-header">
                                    <div className="recent-post-community">
                                        {post.community ? (
                                            <>
                                                <div className="recent-post-icon">
                                                    <div className="recent-post-icon-placeholder">
                                                        r/
                                                    </div>
                                                </div>
                                                <span className="recent-post-community-name">
                                                    r/{post.community.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="recent-post-icon">
                                                    <img 
                                                        src={`/character/${post.author?.avatar || 'char'}.png`}
                                                        alt=""
                                                    />
                                                </div>
                                                <span className="recent-post-community-name">
                                                    u/{post.author?.username}
                                                </span>
                                            </>
                                        )}
                                        <span className="recent-post-time">• {formatTime(post.createdAt)}</span>
                                    </div>
                                </div>
                                <h4 className="recent-post-title">{post.title}</h4>
                                <div className="recent-post-stats">
                                    <span className="recent-post-stat">
                                        {voteCount} upvote{voteCount !== 1 ? 's' : ''}
                                    </span>
                                    <span className="recent-post-dot">•</span>
                                    <span className="recent-post-stat">
                                        {commentCount} comment{commentCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            {thumbnail && (
                                <div className="recent-post-thumbnail">
                                    <img src={thumbnail} alt="" />
                                    {images.length > 1 && (
                                        <div className="recent-post-image-count">
                                            <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
                                                <path d="M17 1H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V3a2 2 0 00-2-2zm0 16H3V3h14v14zM5 7h10v2H5V7zm0 4h10v2H5v-2z"/>
                                            </svg>
                                            {images.length}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RecentPosts;

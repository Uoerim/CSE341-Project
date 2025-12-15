import React, { useState, useEffect } from "react";
import "./postDetail.css";
import axios from "axios";

function PostDetail({ postId, onClose }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sortBy, setSortBy] = useState("Best");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/posts/${postId}`);
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        fetchComments();
    }, [postId, apiUrl]);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const response = await axios.get(`${apiUrl}/comments/post/${postId}`);
            setComments(response.data);
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !token) return;
        
        try {
            setIsPostingComment(true);
            await axios.post(
                `${apiUrl}/comments`,
                {
                    content: newComment,
                    post: postId,
                    parentComment: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchComments();
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment:", err);
            alert("Failed to post comment");
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleReplyComment = async (parentCommentId) => {
        if (!replyText.trim() || !token) return;
        
        try {
            await axios.post(
                `${apiUrl}/comments`,
                {
                    content: replyText,
                    post: postId,
                    parentComment: parentCommentId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchComments();
            setReplyingTo(null);
            setReplyText("");
        } catch (err) {
            console.error("Error posting reply:", err);
            alert("Failed to post reply");
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 30) return `${diffDays}d ago`;
        
        return postDate.toLocaleDateString();
    };

    const getVoteCount = () => {
        if (!post) return 0;
        return (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
    };

    const renderComment = (comment, isNested = false) => {
        const replies = comments.filter(c => c.parentComment === comment._id);
        const isOP = post && comment.author._id === post.author._id;
        
        return (
            <div key={comment._id} className={`comment-wrapper ${isNested ? 'nested' : ''}`}>
                <div className="comment-thread-line"></div>
                <div className="comment-content-wrapper">
                    <div className="comment-header">
                        <div className="comment-avatar">
                            {comment.author.avatar ? (
                                <img src={comment.author.avatar} alt="" />
                            ) : (
                                <div className="comment-avatar-placeholder">
                                    {comment.author.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="comment-author">{comment.author.username}</span>
                        {isOP && <span className="op-badge">OP</span>}
                        <span className="comment-dot">•</span>
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="comment-body">
                        {comment.content}
                    </div>
                    <div className="comment-actions">
                        <button className="comment-vote-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M12 4l-8 8h6v8h4v-8h6l-8-8z"/>
                            </svg>
                        </button>
                        <span className="comment-votes">0</span>
                        <button className="comment-vote-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M12 20l8-8h-6V4h-4v8H4l8 8z"/>
                            </svg>
                        </button>
                        <button 
                            className="comment-action-btn"
                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                            </svg>
                            Reply
                        </button>
                        <button className="comment-action-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Award
                        </button>
                        <button className="comment-action-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                            </svg>
                            Share
                        </button>
                        <button className="comment-action-btn more-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </button>
                    </div>

                    {replyingTo === comment._id && (
                        <div className="reply-input-wrapper">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="What are your thoughts?"
                                className="reply-textarea"
                                autoFocus
                            />
                            <div className="reply-actions">
                                <button
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                    }}
                                    className="cancel-reply-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReplyComment(comment._id)}
                                    className="submit-reply-btn"
                                    disabled={!replyText.trim()}
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}

                    {replies.length > 0 && (
                        <div className="nested-replies">
                            {replies.map(reply => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="post-detail-page">
                <div className="post-detail-loading">Loading...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail-page">
                <div className="post-detail-error">{error || "Post not found"}</div>
            </div>
        );
    }

    return (
        <div className="post-detail-page">
            <div className="post-detail-wrapper">
                {/* Header with back button and community info */}
                <div className="post-header-row">
                    <button className="back-btn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </button>
                    <div className="community-info">
                        <div className="community-icon">
                            {post.community?.icon ? (
                                <img src={post.community.icon} alt="" />
                            ) : (
                                <div className="community-icon-placeholder">r/</div>
                            )}
                        </div>
                        <span className="community-name">
                            {post.community ? `r/${post.community.name}` : `u/${post.author.username}`}
                        </span>
                        <span className="header-dot">•</span>
                        <span className="post-time-header">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="author-info">
                        <span className="author-name">{post.author.username}</span>
                    </div>
                    <button className="more-options-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>

                {/* Post title */}
                <h1 className="post-title">{post.title}</h1>

                {/* Post content/image */}
                <div className="post-media">
                    <div className="post-content-area" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Action bar */}
                <div className="post-actions-bar">
                    <div className="vote-container">
                        <button className="vote-btn upvote">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M12 4l-8 8h6v8h4v-8h6l-8-8z"/>
                            </svg>
                        </button>
                        <span className="vote-count">{getVoteCount()}</span>
                        <button className="vote-btn downvote">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M12 20l8-8h-6V4h-4v8H4l8 8z"/>
                            </svg>
                        </button>
                    </div>
                    <button className="action-bar-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                        </svg>
                        <span>{comments.length}</span>
                    </button>
                    <button className="action-bar-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                        <span>Share</span>
                    </button>
                </div>

                {/* Comments section */}
                <div className="comments-section">
                    {/* Comment input */}
                    <div className="comment-input-box">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Join the conversation"
                            className="main-comment-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newComment.trim()) {
                                    handlePostComment();
                                }
                            }}
                        />
                        <button 
                            className="emoji-btn"
                            disabled={isPostingComment}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                            </svg>
                        </button>
                    </div>

                    {/* Sort options */}
                    <div className="comments-sort">
                        <span className="sort-label">Sort by:</span>
                        <button className="sort-dropdown">
                            {sortBy}
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                            </svg>
                        </button>
                        <div className="search-comments">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            <span>Search Comments</span>
                        </div>
                    </div>

                    {/* Comments list */}
                    <div className="comments-list">
                        {commentsLoading ? (
                            <div className="comments-loading">Loading comments...</div>
                        ) : comments.filter(c => !c.parentComment).length === 0 ? (
                            <div className="no-comments">No comments yet. Be the first to comment!</div>
                        ) : (
                            comments
                                .filter(c => !c.parentComment)
                                .map(comment => renderComment(comment))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;

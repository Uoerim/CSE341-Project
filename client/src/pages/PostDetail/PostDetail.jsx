import React, { useState, useEffect } from "react";
import "./postDetail.css";
import Spinner from "../../components/Global/Spinner/Spinner";
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
    const [commentBoxExpanded, setCommentBoxExpanded] = useState(false);
    const [postVotes, setPostVotes] = useState({ upvotes: 0, downvotes: 0 });
    const [userPostVote, setUserPostVote] = useState(null);
    const [isPostVoting, setIsPostVoting] = useState(false);
    const [commentVotes, setCommentVotes] = useState({});
    const [userCommentVotes, setUserCommentVotes] = useState({});
    const [votingComments, setVotingComments] = useState({});
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/posts/${postId}`);
                const postData = response.data;
                setPost(postData);
                
                // Set initial post vote state
                setPostVotes({
                    upvotes: postData.upvotes?.length || 0,
                    downvotes: postData.downvotes?.length || 0,
                });
                
                // Check if user has voted on this post
                if (userId) {
                    if (postData.upvotes?.includes(userId)) {
                        setUserPostVote('up');
                    } else if (postData.downvotes?.includes(userId)) {
                        setUserPostVote('down');
                    }
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
            fetchComments();
        }
    }, [postId, apiUrl, userId]);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const response = await axios.get(`${apiUrl}/comments/post/${postId}`);
            const commentsData = response.data;
            setComments(commentsData);
            
            // Initialize comment vote states
            const votes = {};
            const userVotes = {};
            commentsData.forEach(comment => {
                votes[comment._id] = {
                    upvotes: comment.upvotes?.length || 0,
                    downvotes: comment.downvotes?.length || 0,
                };
                if (userId) {
                    if (comment.upvotes?.includes(userId)) {
                        userVotes[comment._id] = 'up';
                    } else if (comment.downvotes?.includes(userId)) {
                        userVotes[comment._id] = 'down';
                    }
                }
            });
            setCommentVotes(votes);
            setUserCommentVotes(userVotes);
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handlePostVote = async (type) => {
        if (!token) {
            alert("Please log in to vote");
            return;
        }
        if (isPostVoting) return;

        try {
            setIsPostVoting(true);
            const endpoint = type === 'up' ? 'upvote' : 'downvote';
            const response = await axios.put(
                `${apiUrl}/posts/${postId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPostVotes({
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
            });

            if (type === 'up') {
                setUserPostVote(userPostVote === 'up' ? null : 'up');
            } else {
                setUserPostVote(userPostVote === 'down' ? null : 'down');
            }
        } catch (err) {
            console.error("Error voting on post:", err);
        } finally {
            setIsPostVoting(false);
        }
    };

    const handleCommentVote = async (commentId, type) => {
        if (!token) {
            alert("Please log in to vote");
            return;
        }
        if (votingComments[commentId]) return;

        try {
            setVotingComments(prev => ({ ...prev, [commentId]: true }));
            const endpoint = type === 'up' ? 'upvote' : 'downvote';
            const response = await axios.put(
                `${apiUrl}/comments/${commentId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCommentVotes(prev => ({
                ...prev,
                [commentId]: {
                    upvotes: response.data.upvotes,
                    downvotes: response.data.downvotes,
                }
            }));

            setUserCommentVotes(prev => {
                const currentVote = prev[commentId];
                if (type === 'up') {
                    return { ...prev, [commentId]: currentVote === 'up' ? null : 'up' };
                } else {
                    return { ...prev, [commentId]: currentVote === 'down' ? null : 'down' };
                }
            });
        } catch (err) {
            console.error("Error voting on comment:", err);
        } finally {
            setVotingComments(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !token) return;
        
        try {
            setIsPostingComment(true);
            const response = await axios.post(
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
            
            // Add the new comment to the list immediately
            const newCommentData = response.data;
            setComments(prev => [...prev, newCommentData]);
            
            // Initialize vote state for the new comment
            setCommentVotes(prev => ({
                ...prev,
                [newCommentData._id]: { upvotes: 0, downvotes: 0 }
            }));
            
            setNewComment("");
            setCommentBoxExpanded(false);
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
            const response = await axios.post(
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
            
            // Add the new reply to the list immediately
            const newReplyData = response.data;
            setComments(prev => [...prev, newReplyData]);
            
            // Initialize vote state for the new reply
            setCommentVotes(prev => ({
                ...prev,
                [newReplyData._id]: { upvotes: 0, downvotes: 0 }
            }));
            
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
        return postVotes.upvotes - postVotes.downvotes;
    };

    const getCommentVoteCount = (commentId) => {
        const votes = commentVotes[commentId];
        if (!votes) return 0;
        return votes.upvotes - votes.downvotes;
    };

    const renderComment = (comment, isNested = false) => {
        const replies = comments.filter(c => c.parentComment && c.author && c.parentComment.toString() === comment._id.toString());
        const isOP = post && comment.author && post.author && 
            (comment.author._id?.toString() === post.author._id?.toString() ||
             comment.author._id === post.author._id);
        // Skip comments with no author (shouldn't happen, but safety check)
        if (!comment.author) {
            return null;
        }
        
        return (
            <div key={comment._id} className={`comment-item ${isNested ? 'nested' : ''}`}>
                <div className="comment-thread-line"></div>
                <div className="comment-main">
                    <div className="comment-header">
                        <div className="comment-avatar">
                            <img 
                                src={`/character/${comment.author?.avatar || 'char'}.png`} 
                                alt="" 
                            />
                        </div>
                        <span className="comment-author">{comment.author?.username || 'Unknown'}</span>
                        {isOP && <span className="op-badge">OP</span>}
                        <span className="comment-dot">•</span>
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="comment-body">
                        {comment.content}
                    </div>
                    <div className="comment-actions">
                        <button 
                            className={`comment-vote-btn ${userCommentVotes[comment._id] === 'up' ? 'active upvote' : ''}`}
                            onClick={() => handleCommentVote(comment._id, 'up')}
                            disabled={votingComments[comment._id]}
                        >
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
                            </svg>
                        </button>
                        <span className={`comment-votes ${userCommentVotes[comment._id] === 'up' ? 'upvoted' : ''} ${userCommentVotes[comment._id] === 'down' ? 'downvoted' : ''}`}>
                            {getCommentVoteCount(comment._id)}
                        </span>
                        <button 
                            className={`comment-vote-btn ${userCommentVotes[comment._id] === 'down' ? 'active downvote' : ''}`}
                            onClick={() => handleCommentVote(comment._id, 'down')}
                            disabled={votingComments[comment._id]}
                        >
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z"></path>
                            </svg>
                        </button>
                        <button 
                            className="comment-action-btn"
                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        >
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                            </svg>
                            Reply
                        </button>
                        <button className="comment-action-btn">
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M18.75 14.536l-2.414-3.581A6.947 6.947 0 0017 8c0-3.86-3.14-7-6.999-7-3.859 0-6.999 3.14-6.999 7 0 1.057.242 2.056.664 2.955l-2.414 3.581c-.289.428-.33.962-.109 1.429.22.467.658.776 1.173.826l1.575.151.758 1.494a1.435 1.435 0 001.297.795c.482 0 .926-.234 1.198-.639l2.437-3.612c.14.008.28.021.423.021.143 0 .282-.013.423-.021l2.437 3.612c.272.405.716.639 1.198.639.031 0 .062 0 .094-.003a1.435 1.435 0 001.203-.791l.758-1.495 1.576-.151c.514-.05.952-.358 1.172-.826a1.434 1.434 0 00-.109-1.429h-.006zM10 2.8A5.205 5.205 0 0115.2 8c0 2.867-2.333 5.2-5.2 5.2A5.205 5.205 0 014.801 8c0-2.867 2.332-5.2 5.2-5.2zM5.982 17.09l-.937-1.846-1.974-.189 1.66-2.462a7.02 7.02 0 002.936 1.999L5.982 17.09zm10.947-2.035l-1.974.189-.937 1.846-1.685-2.499a7.013 7.013 0 002.936-1.999l1.66 2.462v.001z"></path>
                            </svg>
                            Award
                        </button>
                        <button className="comment-action-btn">
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M12.8 17.524l6.89-6.887a.9.9 0 000-1.273L12.8 2.477a1.64 1.64 0 00-1.782-.349 1.64 1.64 0 00-1.014 1.518v2.593C4.054 6.728 1.192 12.075 1 17.376a1.353 1.353 0 00.862 1.32 1.35 1.35 0 001.531-.364l.334-.381c1.705-1.944 3.323-3.791 6.277-4.103v2.509c0 .667.398 1.262 1.014 1.518a1.638 1.638 0 001.783-.349v-.002zm-.994-1.548V12h-.9c-3.969 0-6.162 2.1-8.001 4.161.514-4.011 2.823-8.16 8-8.16h.9V4.024L17.784 10l-5.977 5.976z"></path>
                            </svg>
                            Share
                        </button>
                        <button className="comment-action-btn more-btn">
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
                            {replies.map(reply => renderComment(reply, true)).filter(Boolean)}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="post-detail-page">
                <div className="post-detail-loading">
                    <Spinner />
                </div>
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
            <div className="post-detail-layout">
                {/* Left Column - Post Content */}
                <div className="post-detail-main">
                    {/* Header with community info */}
                    <div className="post-header-row">
                        <div className="community-info">
                            <div className="community-icon">
                                <img 
                                    src={`/character/${post.author.avatar || 'char'}.png`} 
                                    alt="" 
                                />
                            </div>
                            <span className="community-name">u/{post.author.username}</span>
                            <span className="header-dot">•</span>
                            <span className="post-time-header">{formatDate(post.createdAt)}</span>
                        </div>
                    </div>

                    {/* Post title */}
                    <h1 className="post-title">{post.title}</h1>

                    {/* Post content/image */}
                    <div className="post-media">
                        <div className="post-content-area" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Action bar */}
                    <div className="post-actions-bar">
                        <div className={`vote-pill ${userPostVote ? 'voted' : ''}`}>
                            <button 
                                className={`vote-btn upvote ${userPostVote === 'up' ? 'active' : ''}`}
                                onClick={() => handlePostVote('up')}
                                disabled={isPostVoting}
                            >
                                <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                    <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
                                </svg>
                            </button>
                            <span className={`vote-count ${userPostVote === 'up' ? 'upvoted' : ''} ${userPostVote === 'down' ? 'downvoted' : ''}`}>{getVoteCount()}</span>
                            <button 
                                className={`vote-btn downvote ${userPostVote === 'down' ? 'active' : ''}`}
                                onClick={() => handlePostVote('down')}
                                disabled={isPostVoting}
                            >
                                <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                    <path d="M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z"></path>
                                </svg>
                            </button>
                        </div>

                        <button className="action-pill">
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                            </svg>
                            <span>{comments.length}</span>
                        </button>

                        <button className="action-pill share-btn">
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                <path d="M12.8 17.524l6.89-6.887a.9.9 0 000-1.273L12.8 2.477a1.64 1.64 0 00-1.782-.349 1.64 1.64 0 00-1.014 1.518v2.593C4.054 6.728 1.192 12.075 1 17.376a1.353 1.353 0 00.862 1.32 1.35 1.35 0 001.531-.364l.334-.381c1.705-1.944 3.323-3.791 6.277-4.103v2.509c0 .667.398 1.262 1.014 1.518a1.638 1.638 0 001.783-.349v-.002zm-.994-1.548V12h-.9c-3.969 0-6.162 2.1-8.001 4.161.514-4.011 2.823-8.16 8-8.16h.9V4.024L17.784 10l-5.977 5.976z"></path>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>

                    {/* Comments section */}
                    <div className="comments-section">
                        {/* Comment input */}
                        <div className={`comment-input-box ${commentBoxExpanded ? 'expanded' : ''}`}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment"
                                className="main-comment-input"
                                onFocus={() => setCommentBoxExpanded(true)}
                                rows={commentBoxExpanded ? 3 : 1}
                            />
                            {commentBoxExpanded && (
                                <div className="comment-box-footer">
                                    <div className="comment-box-left">
                                        <button className="comment-media-btn">
                                            <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20">
                                                <path d="M1.75 1.35a.41.41 0 00-.41.41v12.48c0 .226.184.41.41.41h10.5a.41.41 0 00.41-.41V1.76a.41.41 0 00-.41-.41H1.75zM0 1.76C0 .788.788 0 1.75 0h10.5C13.212 0 14 .788 14 1.76v12.48c0 .972-.788 1.76-1.75 1.76H1.75C.788 16 0 15.212 0 14.24V1.76zm3.75 5.74a2 2 0 100-4 2 2 0 000 4zM13 10.268l-2.955-2.955a.625.625 0 00-.884 0l-3.39 3.39-1.443-1.444a.625.625 0 00-.884 0L1 11.703v2.537c0 .138.112.25.25.25h11.5a.25.25 0 00.25-.25v-3.972z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="comment-box-right">
                                        <button className="comment-more-btn">
                                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </button>
                                        <button 
                                            className="comment-cancel-btn"
                                            onClick={() => {
                                                setCommentBoxExpanded(false);
                                                setNewComment("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="comment-submit-btn"
                                            onClick={handlePostComment}
                                            disabled={!newComment.trim() || isPostingComment}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Comments list */}
                        <div className="comments-list">
                            {commentsLoading ? (
                                <div className="comments-loading"><Spinner /></div>
                            ) : comments.filter(c => !c.parentComment && c.author).length === 0 ? (
                                <div className="no-comments">No comments yet. Be the first to comment!</div>
                            ) : (
                                comments
                                    .filter(c => !c.parentComment && c.author)
                                    .map(comment => renderComment(comment))
                                    .filter(Boolean)
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar (blank for now) */}
                <div className="post-detail-sidebar">
                    {/* Sidebar content will go here */}
                </div>
            </div>
        </div>
    );
}

export default PostDetail;

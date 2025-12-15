import React, { useState, useEffect, useRef, useCallback } from "react";
import "./home.css";
import Post from "../../components/Post/Post";
import Spinner from "../../components/Global/Spinner/Spinner";
import axios from "axios";

function Home({ onPostClick }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadedPostIdsRef = useRef(new Set());
    const observerTarget = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // Fetch posts
    const fetchPosts = useCallback(async (pageNum) => {
        setLoading(true);
        try {
            const excludeStr = Array.from(loadedPostIdsRef.current).join(",");
            const url = excludeStr 
                ? `${apiUrl}/posts/feed?page=${pageNum}&limit=10&exclude=${excludeStr}`
                : `${apiUrl}/posts/feed?page=${pageNum}&limit=10`;

            const response = await axios.get(url);
            const { posts: newPosts, pagination } = response.data;

            // Filter out any posts that are already loaded (safety check for duplicates)
            const uniqueNewPosts = newPosts.filter(post => !loadedPostIdsRef.current.has(post._id));

            if (uniqueNewPosts.length > 0) {
                // Add new post IDs to the set
                uniqueNewPosts.forEach(post => {
                    loadedPostIdsRef.current.add(post._id);
                });
                
                setPosts((prevPosts) => [...prevPosts, ...uniqueNewPosts]);
                setHasMore(pagination.hasMore);
            } else if (newPosts.length === 0) {
                // No posts returned means we've reached the end
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    // Initial load
    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    fetchPosts((loadedPostIdsRef.current.size / 10) + 1);
                }
            },
            { threshold: 0.1 }
        );

        const target = observerTarget.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [loading, hasMore, fetchPosts]);

    return (
        <div className="page-container home-container">
            <div className="home-layout">
                <div className="feed-wrapper">
                    {posts.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No posts yet. Check back later!</p>
                        </div>
                    )}

                    <div className="posts-list">
                        {posts.map((post) => (
                            <Post 
                                key={post._id} 
                                post={post}
                                onPostClick={onPostClick}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div ref={observerTarget} className="loading-trigger">
                            {loading && <Spinner />}
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="end-message">
                            <p>You've reached the end of the feed!</p>
                        </div>
                    )}
                </div>

                <div className="home-sidebar">
                    <div className="sidebar-footer">
                        <div className="footer-links">
                            <a href="/rules">Loopify Rules</a>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">User Agreement</a>
                        </div>
                        <div className="footer-links">
                            <a href="/accessibility">Accessibility</a>
                        </div>
                        <div className="footer-copyright">
                            Loopify, Inc. © 2025. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

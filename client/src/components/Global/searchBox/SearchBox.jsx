import React, { useState } from "react";
import "./searchBox.css";
import { globalSearch } from "../../../services/searchService";
import { getTrendingPosts } from "../../../services/trendingService";



import { useEffect } from "react";

function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], communities: [], posts: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasTyped, setHasTyped] = useState(false);
    const [trending, setTrending] = useState([]);
    let searchTimeout = null;

    // Fetch trending posts on mount
    useEffect(() => {
        getTrendingPosts().then(res => {
            setTrending(res.trending || []);
        }).catch(() => setTrending([]));
    }, []);

    // Debounced search
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setHasTyped(true);
        setError("");
        if (searchTimeout) clearTimeout(searchTimeout);
        if (!value.trim()) {
            setResults({ users: [], communities: [], posts: [] });
            setLoading(false);
            return;
        }
        setLoading(true);
        searchTimeout = setTimeout(async () => {
            try {
                const res = await globalSearch(value);
                setResults(res);
                setLoading(false);
            } catch (err) {
                setError("Failed to search. Please try again.");
                setLoading(false);
            }
        }, 400);
    };

    // Handle dropdown open/close
    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setTimeout(() => setIsOpen(false), 200);

    // Professional result rendering
    const renderResults = () => {
        if (loading) {
            return (
                <div className="search-dropdown-content">
                    <div className="search-dropdown-item">Loading...</div>
                </div>
            );
        }
        if (error) {
            return (
                <div className="search-dropdown-content">
                    <div className="search-dropdown-item" style={{ color: 'red' }}>{error}</div>
                </div>
            );
        }
        if (!query.trim() && !hasTyped) {
            // Trending fallback: show trending posts from backend
            return (
                <>
                    <div className="search-dropdown-header">Trending</div>
                    <div className="search-dropdown-content">
                        {trending.length === 0 && (
                            <div className="search-dropdown-item">No trending posts.</div>
                        )}
                        {trending.slice(0, 5).map((post) => (
                            <div key={post._id} className="search-dropdown-item">
                                {post.images && post.images.length > 0 && post.images[0] ? (
                                    <img src={post.images[0]} alt="post" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', marginRight: 10 }} />
                                ) : (
                                    <svg rpl="" fill="currentColor" height="20" icon-name="trend" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.098 17a3.098 3.098 0 01-2.192-5.291l3.647-3.647a3.104 3.104 0 014.385 0l.308.309 1.672-1.672-1.55-1.548a1.254 1.254 0 01-.271-1.373 1.254 1.254 0 011.163-.777h7.84a.9.9 0 01.9.9v7.84c0 .512-.306.968-.777 1.163a1.256 1.256 0 01-1.373-.272l-1.548-1.549-3.861 3.862c-1.172 1.17-3.213 1.17-4.385 0l-.308-.309-1.457 1.458A3.099 3.099 0 014.098 17zm3.647-8.045c-.347 0-.674.135-.92.381L3.18 12.983a1.302 1.302 0 000 1.839 1.302 1.302 0 001.838 0l2.73-2.73 1.58 1.581a1.3 1.3 0 001.839 0L16.3 8.539l1.897 1.899V4.804h-5.634l1.899 1.897-4.218 4.218-1.581-1.581a1.289 1.289 0 00-.92-.381l.002-.002z"></path>
                                    </svg>
                                )}
                                <div className="item-content">
                                    <div className="item-title">{post.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }
        // Prioritize users > communities > posts
        return (
            <>
                {results.users.length > 0 && (
                    <>
                        <div className="search-dropdown-header">Users</div>
                        <div className="search-dropdown-content">
                            {results.users.map((user) => (
                                <div key={user._id} className="search-dropdown-item">
                                    <img src={user.avatar || "/default-avatar.png"} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10 }} />
                                    <div className="item-content">
                                        <div className="item-title">{user.username}</div>
                                        <div className="item-subtitle">{user.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {results.communities.length > 0 && (
                    <>
                        <div className="search-dropdown-header">Communities</div>
                        <div className="search-dropdown-content">
                            {results.communities.map((community) => (
                                <div key={community._id} className="search-dropdown-item">
                                    <svg className="item-icon" fill="#3543ff" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-title">{community.name}</div>
                                        <div className="item-subtitle">{community.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {results.posts.length > 0 && (
                    <>
                        <div className="search-dropdown-header">Posts</div>
                        <div className="search-dropdown-content">
                            {results.posts.map((post) => (
                                <div key={post._id} className="search-dropdown-item">
                                    <svg className="item-icon" fill="#ff4500" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="4" y="4" width="16" height="16" rx="3" />
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-title">{post.title}</div>
                                        <div className="item-subtitle">{post.content?.slice(0, 60)}...</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {results.users.length === 0 && results.communities.length === 0 && results.posts.length === 0 && (
                    <div className="search-dropdown-content">
                        <div className="search-dropdown-item">No results found.</div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="search-box-container">
            <div className="search-box" onClick={handleFocus}>
                <div className="search-logo">
                    <img className="search-box-logo" src="/logo-white-notext.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder="Find anything"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <button
                    className="search-ask-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (query.trim()) handleInputChange({ target: { value: query } });
                    }}
                >
                    <div className="search-loader" style={{ visibility: loading ? 'visible' : 'hidden' }}></div>
                    <span>Ask</span>
                </button>
            </div>
            {isOpen && (
                <div className="search-dropdown">
                    {renderResults()}
                </div>
            )}
        </div>
    );
}

export default SearchBox;

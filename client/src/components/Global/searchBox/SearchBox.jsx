
import React, { useState, useRef } from "react";
import "./searchBox.css";
import { globalSearch } from "../../services/searchService";

function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], communities: [], posts: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef();

    // Debounce search
    const debounceTimeout = useRef();
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setError("");
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (!value.trim()) {
            setResults({ users: [], communities: [], posts: [] });
            return;
        }
        debounceTimeout.current = setTimeout(() => {
            doSearch(value);
        }, 350);
    };

    const doSearch = async (q) => {
        setLoading(true);
        setError("");
        try {
            const res = await globalSearch(q);
            setResults(res);
        } catch (err) {
            setError(err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setTimeout(() => setIsOpen(false), 200);

    // Prioritize: users > communities > posts
    const hasResults =
        results.users.length > 0 ||
        results.communities.length > 0 ||
        results.posts.length > 0;

    return (
        <div className="search-box-container">
            <div className="search-box" onClick={handleFocus}>
                <div className="search-logo">
                    <img className="search-box-logo" src="/logo-white-notext.png" alt="" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder="Find users, communities, posts..."
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    autoComplete="off"
                />
                <button
                    className="search-ask-button"
                    tabIndex={-1}
                    type="button"
                    onClick={e => e.preventDefault()}
                >
                    {loading ? <div className="search-loader"></div> : <div style={{ width: 20 }} />}
                    <span>Ask</span>
                </button>
            </div>

            {isOpen && (query.trim() || loading || error) && (
                <div className="search-dropdown">
                    <div className="search-dropdown-content">
                        {loading && (
                            <div className="search-dropdown-loading">Searching...</div>
                        )}
                        {error && (
                            <div className="search-dropdown-error">{error}</div>
                        )}
                        {!loading && !error && hasResults && (
                            <>
                                {results.users.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-header">Users</div>
                                        {results.users.map(user => (
                                            <div className="search-dropdown-item user" key={user._id}>
                                                <img src={user.avatar || "/default-avatar.png"} alt="avatar" className="search-avatar" />
                                                <div className="item-content">
                                                    <div className="item-title">{user.username}</div>
                                                    <div className="item-subtitle">{user.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {results.communities.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-header">Communities</div>
                                        {results.communities.map(comm => (
                                            <div className="search-dropdown-item community" key={comm._id}>
                                                <div className="item-content">
                                                    <div className="item-title">{comm.name}</div>
                                                    <div className="item-subtitle">{comm.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {results.posts.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-header">Posts</div>
                                        {results.posts.map(post => (
                                            <div className="search-dropdown-item post" key={post._id}>
                                                <div className="item-content">
                                                    <div className="item-title">{post.title}</div>
                                                    <div className="item-subtitle">
                                                        {post.community?.name ? `c/${post.community.name}` : ""} by {post.author?.username || "Unknown"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {!loading && !error && !hasResults && (
                            <div className="search-dropdown-empty">No results found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBox;

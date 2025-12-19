import React, { useState } from "react";
import "./searchBox.css";
import { globalSearch } from "../../../services/searchService";


function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], communities: [], posts: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasTyped, setHasTyped] = useState(false);
    let searchTimeout = null;

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
            // Trending fallback
            const trendingItems = [
                { id: 1, title: "iOS 26.2 Release and Features", subtitle: "Based on your interests" },
                { id: 2, title: "Dota 2 Patch 7.40", subtitle: "Based on your interests" },
                { id: 3, title: "ChatGPT 5.2 Features", subtitle: "Based on your interests" },
                { id: 4, title: "Goosemas 2025 Providence", subtitle: "Based on your interests" },
                { id: 5, title: "Brown University Shooting", subtitle: "Based on your interests" },
                { id: 6, title: "The Game Awards 2025 Winners", subtitle: "Based on your interests" },
            ];
            return (
                <>
                    <div className="search-dropdown-header">Trending</div>
                    <div className="search-dropdown-content">
                        {trendingItems.map((item) => (
                            <div key={item.id} className="search-dropdown-item">
                                <svg className="item-icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2zm4 2h2v14h-2z"></path>
                                </svg>
                                <div className="item-content">
                                    <div className="item-title">{item.title}</div>
                                    <div className="item-subtitle">{item.subtitle}</div>
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

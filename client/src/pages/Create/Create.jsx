import React, { useState, useEffect } from "react";
import "./create.css";
import RichTextEditor from "../../components/Global/RichTextEditor";
import Textbox from "../../components/Global/textbox/textbox";

function Create({ onNavigateHome }) {
    const placeholderCommunities = [
        { _id: "p1", name: "analog", members: 2679631 },
        { _id: "p2", name: "AskAnAmerican", members: 1099581 },
        { _id: "p3", name: "AskMen", members: 7103981 },
        { _id: "p4", name: "AskWomen", members: 5590440 },
        { _id: "p5", name: "assholdedesign", members: 3096237 },
        { _id: "p6", name: "BadArt", members: 343658 },
        { _id: "p7", name: "BadDesigns", members: 897539 },
        { _id: "p8", name: "beyondthebump", members: 145230 },
        { _id: "p9", name: "Branding", members: 89432 },
        { _id: "p10", name: "CasualConversation", members: 1234567 },
    ];

    const [communities, setCommunities] = useState(placeholderCommunities);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [activeTab, setActiveTab] = useState("text");
    const [title, setTitle] = useState("");
    const [bodyText, setBodyText] = useState("");
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const [communitySearch, setCommunitySearch] = useState("");
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchCommunities();
        fetchUserData();
    }, []);

    const fetchCommunities = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/communities", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCommunities(data.length > 0 ? data : placeholderCommunities);
            }
        } catch (error) {
            console.error("Failed to fetch communities:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const fetchDrafts = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/posts/user/drafts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDrafts(data);
                setShowDrafts(true);
            }
        } catch (error) {
            console.error("Failed to fetch drafts:", error);
        }
    };

    const handleLoadDraft = (draft) => {
        setTitle(draft.title);
        setBodyText(draft.content || "");
        if (draft.community) {
            const community = communities.find(c => c._id === draft.community._id);
            setSelectedCommunity(community || draft.community);
        }
        setShowDrafts(false);
    };

    const handleSaveDraft = async () => {
        try {
            if (!title.trim()) {
                setError("Title is required");
                return;
            }

            setLoading(true);
            setError("");
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content: bodyText,
                    community: selectedCommunity?._id || null,
                    status: "draft",
                }),
            });

            if (response.ok) {
                setTitle("");
                setBodyText("");
                setSelectedCommunity(null);
                alert("Draft saved successfully!");
            } else {
                const data = await response.json();
                setError(data.message || "Failed to save draft");
            }
        } catch (error) {
            console.error("Failed to save draft:", error);
            setError("An error occurred while saving the draft");
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        try {
            if (!title.trim()) {
                setError("Title is required");
                return;
            }

            setLoading(true);
            setError("");
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content: bodyText,
                    community: selectedCommunity?._id || null,
                    status: "published",
                }),
            });

            if (response.ok) {
                setTitle("");
                setBodyText("");
                setSelectedCommunity(null);
                alert("Post created successfully!");
                if (onNavigateHome) {
                    onNavigateHome();
                }
            } else {
                const data = await response.json();
                setError(data.message || "Failed to create post");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("An error occurred while creating the post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-container">
            <div className="create-header">
                <h1>Create post</h1>
                <button className="drafts-btn" onClick={fetchDrafts}>
                    Drafts
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showDrafts && (
                <div className="drafts-modal">
                    <div className="drafts-content">
                        <h2>Your Drafts</h2>
                        <button className="close-drafts" onClick={() => setShowDrafts(false)}>
                            ✕
                        </button>
                        {drafts.length === 0 ? (
                            <p>No drafts yet</p>
                        ) : (
                            <div className="drafts-list">
                                {drafts.map((draft) => (
                                    <div key={draft._id} className="draft-item">
                                        <div className="draft-info">
                                            <h3>{draft.title}</h3>
                                            <p>{draft.content?.substring(0, 100)}...</p>
                                            <small>
                                                {draft.community?.name && `in ${draft.community.name}`}
                                            </small>
                                        </div>
                                        <button 
                                            className="load-draft-btn"
                                            onClick={() => handleLoadDraft(draft)}
                                        >
                                            Load
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="create-body">
                <div className="community-selector">
                    {!isCommunityDropdownOpen ? (
                        <button 
                            className="community-dropdown-btn"
                            onClick={() => setIsCommunityDropdownOpen(true)}
                        >
                            {selectedCommunity ? (
                                <>
                                    <div className="selector-avatar">
                                        <img 
                                            src={`/character/${selectedCommunity.name?.toLowerCase()}.png`}
                                            alt={selectedCommunity.name}
                                        />
                                    </div>
                                    <span>{selectedCommunity.name}</span>
                                </>
                            ) : userData ? (
                                <>
                                    <div className="selector-avatar">
                                        <img 
                                            src={`/character/${userData.avatar}.png`}
                                            alt="User"
                                        />
                                    </div>
                                    <span>u/{userData.username}</span>
                                </>
                            ) : (
                                <>
                                    <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm0 16.2a7.2 7.2 0 110-14.4 7.2 7.2 0 010 14.4z"></path>
                                    </svg>
                                    <span>Select a community</span>
                                </>
                            )}
                            <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                            </svg>
                        </button>
                    ) : (
                        <div className="community-dropdown-search">
                            <input 
                                type="text"
                                placeholder="Select a community"
                                value={communitySearch}
                                onChange={(e) => setCommunitySearch(e.target.value)}
                                autoFocus
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsCommunityDropdownOpen(false);
                                        setCommunitySearch("");
                                    }, 200);
                                }}
                            />
                        </div>
                    )}

                    {isCommunityDropdownOpen && (
                        <div className="community-dropdown">
                            <div className="community-dropdown-list">
                                {userData && (
                                    <div 
                                        className="community-option"
                                        onClick={() => {
                                            setSelectedCommunity(null);
                                            setIsCommunityDropdownOpen(false);
                                            setCommunitySearch("");
                                        }}
                                    >
                                        <div className="option-avatar">
                                            <img 
                                                src={`/character/${userData.avatar}.png`}
                                                alt="Your profile"
                                            />
                                        </div>
                                        <div className="community-option-text">
                                            <div className="community-option-name">u/{userData.username}</div>
                                            <div className="community-option-meta">Your profile</div>
                                        </div>
                                    </div>
                                )}
                                {communities
                                    .filter(community => 
                                        community.name.toLowerCase().includes(communitySearch.toLowerCase())
                                    )
                                    .map((community) => (
                                        <div 
                                            key={community._id} 
                                            className="community-option"
                                            onClick={() => {
                                                setSelectedCommunity(community);
                                                setIsCommunityDropdownOpen(false);
                                                setCommunitySearch("");
                                            }}
                                        >
                                            <div className="option-avatar">
                                                <img 
                                                    src={`/character/${community.name?.toLowerCase()}.png`}
                                                    alt={community.name}
                                                />
                                            </div>
                                            <div className="community-option-text">
                                                <div className="community-option-name">r/{community.name}</div>
                                                <div className="community-option-meta">{community.members || 0} members • Subscribed</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-editor">
                    <div className="title-input-wrapper">
                        <Textbox
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.substring(0, 300))}
                            showCheckmark={true}
                        />
                        <div className="title-counter">{title.length}/300</div>
                    </div>

                    <RichTextEditor 
                        value={bodyText}
                        onChange={setBodyText}
                        placeholder="Body text (optional)"
                    />
                </div>

                <div className="create-actions">
                    <button 
                        className="btn-secondary" 
                        onClick={handleSaveDraft}
                        disabled={loading || !title.trim()}
                    >
                        Save Draft
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={handlePost}
                        disabled={loading || !title.trim() || !bodyText.trim()}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Create;
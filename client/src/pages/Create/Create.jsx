import React, { useState, useEffect } from "react";
import "./create.css";
import RichTextEditor from "../../components/Global/RichTextEditor";

function Create({ onNavigateHome }) {
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [activeTab, setActiveTab] = useState("text");
    const [title, setTitle] = useState("");
    const [bodyText, setBodyText] = useState("");
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCommunities();
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
                setCommunities(data);
            }
        } catch (error) {
            console.error("Failed to fetch communities:", error);
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
                    <button 
                        className="community-dropdown-btn"
                        onClick={() => setIsCommunityDropdownOpen(!isCommunityDropdownOpen)}
                    >
                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm0 16.2a7.2 7.2 0 110-14.4 7.2 7.2 0 010 14.4z"></path>
                        </svg>
                        <span>{selectedCommunity ? selectedCommunity.name : "Select a community"}</span>
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </button>

                    {isCommunityDropdownOpen && (
                        <div className="community-dropdown">
                            {communities.map((community) => (
                                <div 
                                    key={community._id} 
                                    className="community-option"
                                    onClick={() => {
                                        setSelectedCommunity(community);
                                        setIsCommunityDropdownOpen(false);
                                    }}
                                >
                                    {community.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="create-tabs">
                    <button 
                        className={`tab ${activeTab === "text" ? "active" : ""}`}
                        onClick={() => setActiveTab("text")}
                    >
                        Text
                    </button>
                    <button 
                        className={`tab ${activeTab === "images" ? "active" : ""}`}
                        onClick={() => setActiveTab("images")}
                    >
                        Images & Video
                    </button>
                    <button 
                        className={`tab ${activeTab === "link" ? "active" : ""}`}
                        onClick={() => setActiveTab("link")}
                    >
                        Link
                    </button>
                    <button 
                        className={`tab ${activeTab === "poll" ? "active" : ""}`}
                        onClick={() => setActiveTab("poll")}
                        disabled
                    >
                        Poll
                    </button>
                </div>

                {activeTab === "text" && (
                    <div className="text-editor">
                        <input
                            type="text"
                            className="title-input"
                            placeholder="Title *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength="300"
                        />
                        <div className="title-counter">{title.length}/300</div>

                        <div className="add-tags">Add tags</div>

                        <RichTextEditor 
                            value={bodyText}
                            onChange={setBodyText}
                            placeholder="Body text (optional)"
                        />
                    </div>
                )}

                <div className="create-actions">
                    <button 
                        className="btn-secondary" 
                        onClick={handleSaveDraft}
                        disabled={loading}
                    >
                        Save Draft
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={handlePost}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Create;
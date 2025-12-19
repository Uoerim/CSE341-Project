import React, { useState, useEffect } from "react";
import "./create.css";
import RichTextEditor from "../../components/Global/RichTextEditor";
import CommunitySelectorModal from "../../components/Global/CommunitySelectorModal/CommunitySelectorModal";

function Create({ onNavigateHome }) {
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [activeTab, setActiveTab] = useState("text");
    const [title, setTitle] = useState("");
    const [bodyText, setBodyText] = useState("");
    const [showCommunitySelector, setShowCommunitySelector] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const textarea = document.getElementById('innerTextArea');
        if (textarea) {
            textarea.style.height = '20px';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [title]);

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
                    <button 
                        className="community-selector-btn"
                        onClick={() => setShowCommunitySelector(true)}
                    >
                        {selectedCommunity ? (
                            <>
                                <div className="community-selector-icon">
                                    <span>r/</span>
                                </div>
                                <span>r/{selectedCommunity.name}</span>
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
                                <span>Choose a community</span>
                            </>
                        )}
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </button>
                </div>

                <div className="text-editor">
                    <div className="title-input-wrapper">
                        <div className="label-container interior-label">
                            <span className="input-boundary-box">
                                <span className={`input-container ${title ? 'activated' : ''}`}>
                                    <span className="label-text inner-label" id="fp-input-label">
                                        <span>Title</span>
                                        <span className="required-asterisk" aria-hidden="true">*</span>
                                    </span>
                                    <div className="text-area-wrapper" style={{ '--textarea-minheight': '20px' }}>
                                        <textarea
                                            aria-labelledby="fp-input-label"
                                            id="innerTextArea"
                                            className=""
                                            name="title"
                                            maxLength="300"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value.substring(0, 300))}
                                            style={{ height: '20px' }}
                                        />
                                    </div>
                                </span>
                                <span id="trailing-icons-container">
                                    <span id="trailing-icons-validation">
                                        {title && title.length === 0 ? (
                                            <svg rpl="" className="trailing-icon invalid" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                                            </svg>
                                        ) : title && title.length > 0 ? (
                                            <svg rpl="" className="trailing-icon valid" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.09 15.84c-.23 0-.46-.09-.64-.26L1.3 10.42a.9.9 0 010-1.27.9.9 0 011.27 0l4.52 4.52L17.5 3.26a.9.9 0 011.27 0 .9.9 0 010 1.27L7.73 15.58c-.18.18-.41.26-.64.26z"></path>
                                            </svg>
                                        ) : null}
                                    </span>
                                </span>
                            </span>
                        </div>
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

            {showCommunitySelector && (
                <CommunitySelectorModal
                    onClose={() => setShowCommunitySelector(false)}
                    onSelect={setSelectedCommunity}
                    selectedCommunity={selectedCommunity}
                />
            )}
        </div>
    );
}

export default Create;
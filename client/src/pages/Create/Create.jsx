import React, { useState, useEffect } from "react";
import "./create.css";
import RichTextEditor from "../../components/Global/RichTextEditor";
import CommunitySelectorModal from "../../components/Global/CommunitySelectorModal/CommunitySelectorModal";

function Create({ onNavigateHome, fromUserProfile = false }) {
  const [selectedCommunity, setSelectedCommunity] = useState(
    fromUserProfile ? { type: "user", name: "Loading...", id: null } : null
  );
  const [activeTab, setActiveTab] = useState("text");
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [showCommunitySelector, setShowCommunitySelector] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [titleTouched, setTitleTouched] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  const [communitySearchActive, setCommunitySearchActive] = useState(false);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTouched, setLinkTouched] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [linkFocused, setLinkFocused] = useState(false);

  const isValidUrl = (url) => {
    if (!url || url.trim().length === 0) return false;
    let testUrl = url;
    // If URL starts with www., prepend http://
    if (testUrl.toLowerCase().startsWith("www.")) {
      testUrl = "http://" + testUrl;
    }
    try {
      const urlObj = new URL(testUrl);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setCommunityLoading(true);
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
    } finally {
      setCommunityLoading(false);
    }
  };

  useEffect(() => {
    const textarea = document.getElementById("innerTextArea");
    if (textarea) {
      textarea.style.height = "20px";
      textarea.style.height = textarea.scrollHeight + "px";
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
        // If from user profile, set default community
        if (fromUserProfile) {
          setSelectedCommunity({
            type: "user",
            username: data.username,
            id: data._id,
            name: `u/${data.username}`,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchDrafts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/posts/user/drafts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const community = communities.find((c) => c._id === draft.community._id);
      setSelectedCommunity(community || draft.community);
    }
    setShowDrafts(false);
  };

  const timeAgo = (ts) => {
    if (!ts) return "";
    const then = new Date(ts);
    const diff = Math.floor((Date.now() - then.getTime()) / 1000);
    if (diff < 60) return `${diff} sec. ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min. ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr. ago`;
    return `${Math.floor(diff / 86400)} d. ago`;
  };

  const handleEditDraft = (draft) => {
    // reuse load behavior for editing
    handleLoadDraft(draft);
  };

  const handleDeleteDraft = async (draft) => {
    const confirmed = window.confirm("Delete this draft?");
    if (!confirmed) return;
    try {
      // optimistic removal
      setDrafts((prev) => prev.filter((d) => d._id !== draft._id));
      // try server delete if endpoint exists
      const token = localStorage.getItem("authToken");
      await fetch(`http://localhost:5000/api/posts/${draft._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete draft", err);
    }
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
          community:
            selectedCommunity?.type === "user" ? null : selectedCommunity?._id,
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

      if (!selectedCommunity) {
        setError("Please select a community or post to your profile");
        return;
      }

      if (selectedCommunity.type !== "user" && !bodyText.trim()) {
        setError("Post content is required when posting to a community");
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
          community:
            selectedCommunity.type === "user" ? null : selectedCommunity._id,
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
            <div
              className="drafts-modal-header ml-sm"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                Drafts
                <span className="text-14 font-normal text-neutral-content ml-2xs">
                  {drafts.length}/20
                </span>
              </span>
              <button
                className="button-small button-secondary icon items-center justify-center button inline-flex close-drafts mr-sm"
                data-testid="close-button"
                type="button"
                aria-label="Close drafts modal"
                onClick={() => setShowDrafts(false)}
              >
                <span className="flex items-center justify-center">
                  <span className="flex">
                    <svg
                      fill="currentColor"
                      height="16"
                      icon-name="close"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z"></path>
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            {drafts.length === 0 ? (
              <div className="drafts-empty-state">
                <div className="drafts-empty-content">
                  <img
                    className="drafts-empty-img"
                    alt=""
                    src="https://www.redditstatic.com/shreddit/assets/posts-and-comments/pencil.svg"
                  />
                  <h3 className="drafts-empty-title">
                    Save drafts to post when you’re ready
                  </h3>
                  <p className="drafts-empty-desc">
                    When you save a draft, it’ll show up here so you can edit
                    and post it whenever you’d like.
                  </p>
                </div>
              </div>
            ) : (
              <div className="drafts-list">
                {drafts.map((draft) => (
                  <div key={draft._id} className="draft-item">
                    <div className="mr-auto pr-md w-calc">
                      <div className="line-clamp-1 text-14" data-testid="title">
                        {draft.title}
                      </div>
                      <div
                        className="text-12 text-secondary-weak line-clamp-1"
                        data-testid="desc"
                      >
                        {draft.community?.name && `r/${draft.community.name}`}
                        <span className="inline-block mx-xs">·</span>
                        Edited
                        <strong className="mx-xs">
                          {draft.updatedAt ? timeAgo(draft.updatedAt) : ""}
                        </strong>
                      </div>
                    </div>
                    <div className="draft-actions">
                      <button
                        className="mr-2xs last:mr-0 button-small button-plain icon items-center justify-center"
                        data-testid="edit-button"
                        onClick={() => handleEditDraft(draft)}
                        title="Edit"
                      >
                        <span className="icon-edit">
                          <svg
                            rpl=""
                            fill="currentColor"
                            height="16"
                            icon-name="edit"
                            viewBox="0 0 20 20"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M14.016 3.8c.583 0 1.132.227 1.545.64.413.413.64.961.64 1.545a2.17 2.17 0 01-.64 1.545l-8.67 8.67-3.079-.01-.01-3.079 8.669-8.671c.413-.413.962-.64 1.545-.64zm0-1.8a3.97 3.97 0 00-2.817 1.167l-8.948 8.947a.858.858 0 00-.251.609l.014 4.408a.858.858 0 00.855.855L7.277 18h.003c.227 0 .446-.09.606-.251l8.947-8.947A3.985 3.985 0 0014.016 2z"></path>
                          </svg>
                        </span>
                      </button>
                      <button
                        className="mr-2xs last:mr-0 button-small button-plain icon items-center justify-center"
                        data-testid="delete-button"
                        onClick={() => handleDeleteDraft(draft)}
                        title="Delete"
                      >
                        <span className="icon-delete">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M15.2 15.7c0 .83-.67 1.5-1.5 1.5H6.3c-.83 0-1.5-.67-1.5-1.5V7.6H3v8.1C3 17.52 4.48 19 6.3 19h7.4c1.82 0 3.3-1.48 3.3-3.3V7.6h-1.8v8.1zM17.5 5.8c.5 0 .9-.4.9-.9S18 4 17.5 4h-3.63c-.15-1.68-1.55-3-3.27-3H9.4C7.68 1 6.28 2.32 6.13 4H2.5c-.5 0-.9.4-.9.9s.4.9.9.9h15zM7.93 4c.14-.68.75-1.2 1.47-1.2h1.2c.72 0 1.33.52 1.47 1.2H7.93z"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="create-body">
        <div className="community-selector">
          {!communitySearchActive ? (
            <button
              className="community-selector-btn"
              onClick={() => setCommunitySearchActive(true)}
            >
              {selectedCommunity ? (
                <>
                  <div className="community-selector-icon">
                    <span>
                      {selectedCommunity.type === "user" ? "u/" : "r/"}
                    </span>
                  </div>
                  <span>
                    {selectedCommunity.type === "user" ? "u/" : "r/"}
                    {selectedCommunity.name}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    rpl=""
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 20 20"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="community-icon"
                  >
                    <path d="M11.977 13.79h-1.955l4.549-10.715a.81.81 0 00-.381-1.032C12.447 1.12 10.37.747 8.179 1.18c-3.612.716-6.471 3.68-7.059 7.316a9.01 9.01 0 0010.409 10.377c3.735-.616 6.741-3.635 7.347-7.371.453-2.8-.388-5.405-2.017-7.322a.505.505 0 00-.853.119l-4.029 9.49zM9.98 8.118a1.752 1.752 0 00-1.148.167 1.664 1.664 0 00-.651.596 1.703 1.703 0 00-.258.948v3.96H5.998V6.322h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.55 2.55 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.09l-.774 1.849a.766.766 0 00-.244-.073z"></path>
                  </svg>
                  <span className="flex items-center gap-xs">
                    Select a community
                  </span>
                </>
              )}
              <svg
                rpl=""
                fill="currentColor"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
                className="caret-icon"
              >
                <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
              </svg>
            </button>
          ) : (
            <div className="community-search-input-container">
              <span className="leadingIcon">
                <svg
                  rpl=""
                  aria-hidden="true"
                  fill="currentColor"
                  height="16"
                  icon-name="search-outline"
                  viewBox="0 0 20 20"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z"></path>
                </svg>
              </span>
              <input
                type="text"
                name=""
                placeholder="Select a community"
                autoComplete="off"
                inputMode=""
                value={communitySearchQuery}
                onChange={(e) => setCommunitySearchQuery(e.target.value)}
                onBlur={(e) => {
                  setTimeout(() => {
                    if (fromUserProfile && userData && !selectedCommunity) {
                      // only set u/username when there is no selection yet
                      setSelectedCommunity({
                        type: "user",
                        username: userData.username,
                        id: userData._id,
                        name: `u/${userData.username}`,
                      });
                    }
                    setCommunitySearchActive(false);
                    setCommunitySearchQuery("");
                  }, 150);
                }}
                autoFocus
              />
              {communitySearchQuery && (
                <span
                  className="clear-icon-container"
                  onClick={() => {
                    setCommunitySearchQuery("");
                    if (fromUserProfile && userData) {
                      setSelectedCommunity({
                        type: "user",
                        username: userData.username,
                        id: userData._id,
                        name: `u/${userData.username}`,
                      });
                    }
                  }}
                >
                  <svg
                    rpl=""
                    fill="currentColor"
                    height="16"
                    icon-name="clear"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm0 16.2c-3.97 0-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
                    <path d="M12.66 6.06L10 8.73 7.34 6.06 6.06 7.34 8.73 10l-2.67 2.66 1.28 1.28L10 11.27l2.66 2.67 1.28-1.28L11.27 10l2.67-2.66-1.28-1.28z"></path>
                  </svg>
                </span>
              )}

              {communitySearchActive && (
                <div className="community-dropdown-inline">
                  <div className="community-dropdown-list">
                    {fromUserProfile && userData && (
                      <div
                        className="community-option"
                        onClick={() => {
                          setSelectedCommunity({
                            type: "user",
                            username: userData.username,
                            id: userData._id,
                            name: `u/${userData.username}`,
                          });
                          setCommunitySearchActive(false);
                          setCommunitySearchQuery("");
                        }}
                      >
                        <div className="option-avatar">
                          <span>u/</span>
                        </div>
                        <div className="community-option-text">
                          <p className="community-option-name">
                            u/{userData.username}
                          </p>
                          <p className="community-option-meta">
                            Post to your profile
                          </p>
                        </div>
                      </div>
                    )}
                    {communityLoading ? (
                      <div className="community-option">
                        Loading communities...
                      </div>
                    ) : (
                      communities
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .startsWith(communitySearchQuery.toLowerCase())
                        )
                        .map((community) => (
                          <div
                            key={community._id}
                            className="community-option"
                            onClick={() => {
                              setSelectedCommunity(community);
                              setCommunitySearchActive(false);
                              setCommunitySearchQuery("");
                            }}
                          >
                            <div className="option-avatar">
                              {community.icon ? (
                                <img src={community.icon} alt="" />
                              ) : (
                                <span>r/</span>
                              )}
                            </div>
                            <div className="community-option-text">
                              <p className="community-option-name">
                                r/{community.name}
                              </p>
                              <p className="community-option-meta">
                                {community.members?.length || 0} members
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="create-tabs" role="tablist">
          <button
            className={`tab ${activeTab === "text" ? "active" : ""}`}
            onClick={() => setActiveTab("text")}
            role="tab"
            aria-selected={activeTab === "text"}
            type="button"
          >
            <span className="tab-content">
              <span>Text</span>
            </span>
          </button>
          <button
            className={`tab ${activeTab === "images" ? "active" : ""}`}
            onClick={() => setActiveTab("images")}
            role="tab"
            aria-selected={activeTab === "images"}
            type="button"
          >
            <span className="tab-content">
              <span>Images &amp; Video</span>
            </span>
          </button>
          <button
            className={`tab ${activeTab === "link" ? "active" : ""}`}
            onClick={() => setActiveTab("link")}
            role="tab"
            aria-selected={activeTab === "link"}
            type="button"
          >
            <span className="tab-content">
              <span>Link</span>
            </span>
          </button>
        </div>

        <div className="text-editor">
          <div className="title-input-wrapper">
            <div className="label-container interior-label">
              <span
                className={`input-boundary-box ${
                  titleTouched && title.length === 0 && !titleFocused
                    ? "error"
                    : ""
                }`}
              >
                <span className={`input-container ${title ? "activated" : ""}`}>
                  <span className="label-text inner-label" id="fp-input-label">
                    <span>Title</span>
                    <span className="required-asterisk" aria-hidden="true">
                      *
                    </span>
                  </span>
                  <div
                    className="text-area-wrapper"
                    style={{ "--textarea-minheight": "20px" }}
                  >
                    <textarea
                      aria-labelledby="fp-input-label"
                      id="innerTextArea"
                      className=""
                      name="title"
                      maxLength="300"
                      required
                      value={title}
                      onChange={(e) => {
                        const newValue = e.target.value.substring(0, 300);
                        setTitle(newValue);
                        if (newValue.length > 0) {
                          setTitleTouched(true);
                        }
                      }}
                      onFocus={() => setTitleFocused(true)}
                      onBlur={() => setTitleFocused(false)}
                      style={{ height: "20px" }}
                    />
                  </div>
                </span>
                <span id="trailing-icons-container">
                  <span id="trailing-icons-validation">
                    {titleTouched && title.length === 0 ? (
                      <svg
                        rpl=""
                        className="trailing-icon invalid"
                        fill="currentColor"
                        height="20"
                        viewBox="0 0 20 20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                      </svg>
                    ) : title && title.length > 0 ? (
                      <svg
                        rpl=""
                        className="trailing-icon valid"
                        fill="currentColor"
                        height="20"
                        viewBox="0 0 20 20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.09 15.84c-.23 0-.46-.09-.64-.26L1.3 10.42a.9.9 0 010-1.27.9.9 0 011.27 0l4.52 4.52L17.5 3.26a.9.9 0 011.27 0 .9.9 0 010 1.27L7.73 15.58c-.18.18-.41.26-.64.26z"></path>
                      </svg>
                    ) : null}
                  </span>
                </span>
              </span>
            </div>
            <div className="title-counter-wrapper">
              {titleTouched && title.length === 0 && (
                <span className="title-error-message">
                  <svg
                    rpl=""
                    className="mr-2xs text-danger-content"
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                  </svg>
                  <span>Please fill in this field</span>
                </span>
              )}
              <div className="title-counter">{title.length}/300</div>
            </div>
          </div>

          <div className="add-tags-container">
            <button
              className="add-tags-btn"
              disabled={!selectedCommunity}
              aria-label="Select a subreddit to enable flair"
              type="button"
            >
              <span className="add-tags-content">
                <span className="add-tags-text">Add tags</span>
              </span>
            </button>
          </div>

          {activeTab === "text" && (
            <RichTextEditor
              value={bodyText}
              onChange={setBodyText}
              placeholder="Body text (optional)"
            />
          )}

          {activeTab === "images" && (
            <div className="media-upload-section">
              <div className="media-upload-container">
                <div className="media-upload-info">
                  <span>Drag and Drop or upload media</span>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <button
                    className="upload-media-btn"
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <span className="upload-icon">
                      <svg
                        rpl=""
                        fill="currentColor"
                        height="16"
                        icon-name="upload"
                        viewBox="0 0 20 20"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.3 16H6c-2.757 0-5-2.243-5-5a5.006 5.006 0 014.827-4.997c1.226-2.516 3.634-4.067 6.348-4.001a6.991 6.991 0 016.823 6.823 6.65 6.65 0 01-.125 1.434l-1.714-1.714c-.229-2.617-2.366-4.678-5.028-4.744-2.161-.059-4.058 1.307-4.892 3.463l-.247.638S6.448 7.798 6 7.798a3.204 3.204 0 00-3.2 3.2c0 1.764 1.436 3.2 3.2 3.2h4.3V16zm6.616-5.152l-3.28-3.28a.901.901 0 00-1.273 0l-3.28 3.28a.898.898 0 000 1.272.898.898 0 001.272 0l1.744-1.743v7.117a.9.9 0 001.8 0v-7.117l1.744 1.743a.898.898 0 001.272 0 .898.898 0 00.001-1.272z"></path>
                      </svg>
                    </span>
                    <span className="sr-only">Upload files</span>
                  </button>
                </div>
                {selectedFile && (
                  <div className="selected-file-info">
                    <span>{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="remove-file-btn"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="link-input-wrapper">
              <div className="label-container interior-label">
                <span
                  className={`input-boundary-box ${
                    linkTouched && !isValidUrl(linkUrl) && !linkFocused
                      ? "error"
                      : ""
                  }`}
                >
                  <span
                    className={`input-container ${linkUrl ? "activated" : ""}`}
                  >
                    <span
                      className="label-text inner-label"
                      id="link-input-label"
                    >
                      <span>Link URL</span>
                      <span className="required-asterisk" aria-hidden="true">
                        *
                      </span>
                    </span>
                    <div
                      className="text-area-wrapper"
                      style={{ "--textarea-minheight": "20px" }}
                    >
                      <textarea
                        aria-labelledby="link-input-label"
                        id="linkTextArea"
                        className=""
                        name="link"
                        required
                        value={linkUrl}
                        onChange={(e) => {
                          let newValue = e.target.value;
                          // Auto-prepend http:// if user types www.
                          if (
                            newValue.toLowerCase().startsWith("www.") &&
                            !linkUrl.toLowerCase().startsWith("http")
                          ) {
                            newValue = "http://" + newValue;
                          }
                          setLinkUrl(newValue);
                          if (newValue.length > 0) {
                            setLinkTouched(true);
                          }
                        }}
                        onFocus={() => setLinkFocused(true)}
                        onBlur={() => setLinkFocused(false)}
                        style={{ height: "20px" }}
                      />
                    </div>
                  </span>
                  <span id="trailing-icons-container">
                    <span id="trailing-icons-validation">
                      {linkTouched && !isValidUrl(linkUrl) ? (
                        <svg
                          rpl=""
                          className="trailing-icon invalid"
                          fill="currentColor"
                          height="20"
                          viewBox="0 0 20 20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                        </svg>
                      ) : linkUrl && isValidUrl(linkUrl) ? (
                        <svg
                          rpl=""
                          className="trailing-icon valid"
                          fill="currentColor"
                          height="20"
                          viewBox="0 0 20 20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.09 15.84c-.23 0-.46-.09-.64-.26L1.3 10.42a.9.9 0 010-1.27.9.9 0 011.27 0l4.52 4.52L17.5 3.26a.9.9 0 011.27 0 .9.9 0 010 1.27L7.73 15.58c-.18.18-.41.26-.64.26z"></path>
                        </svg>
                      ) : null}
                    </span>
                  </span>
                </span>
              </div>
              <div className="url-error-wrapper">
                {linkTouched && !isValidUrl(linkUrl) && (
                  <span className="url-error-message">
                    <svg
                      rpl=""
                      className="mr-2xs text-danger-content"
                      fill="currentColor"
                      height="16"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
                    </svg>
                    <span>
                      {linkUrl.trim().length === 0
                        ? "Please fill in this field"
                        : "Link doesn't look right"}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="create-actions">
          <button
            className="btn-secondary"
            onClick={handleSaveDraft}
            disabled={
              loading ||
              !title.trim() ||
              (activeTab === "images" && !selectedFile) ||
              (activeTab === "link" && !isValidUrl(linkUrl))
            }
          >
            Save Draft
          </button>
          <button
            className="btn-primary"
            onClick={handlePost}
            disabled={
              loading ||
              !title.trim() ||
              (activeTab === "images" && !selectedFile) ||
              (activeTab === "link" && !isValidUrl(linkUrl))
            }
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;

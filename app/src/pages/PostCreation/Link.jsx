import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./postcreation.css";
import Textbox from "../../components/Global/textbox/textbox";

const TABS = [
  { icon: "fas fa-comment-alt", label: "Text", path: "/postcreation" },
  { icon: "fas fa-image", label: "Images & Video", path: "/postcreation/media" },
  { icon: "fas fa-link", label: "Link", path: "/postcreation/link" },
  { icon: "fas fa-poll", label: "Poll" },
];

const MAX_TITLE = 300;

function extractSiteName(urlString) {
  try {
    const { hostname } = new URL(urlString);
    const cleanHost = hostname.replace(/^www\./i, "");
    const parts = cleanHost.split(".");
    // Pick the second-to-last segment for multi-part TLDs if needed
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
    return cleanHost;
  } catch (err) {
    return "";
  }
}

function Link() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("Select a community");
  const [communityInput, setCommunityInput] = useState("");
  const titleCharCount = title.length;
  const canPost = title.trim().length > 0 && linkUrl.trim().length > 0;

  const handleTabClick = (tab) => {
    if (tab.path) {
      navigate(tab.path);
    }
  };

  const handleCommunityPick = (c) => {
    setSelectedCommunity(c);
    setCommunityOpen(false);
  };

  const openCommunityInput = () => {
    setCommunityInput(selectedCommunity === "Select a community" ? "" : selectedCommunity);
    setCommunityOpen(true);
  };

  const handleCommunityCommit = () => {
    if (communityInput.trim()) {
      setSelectedCommunity(communityInput.trim());
    }
    setCommunityOpen(false);
  };

  const autoFillTitle = useCallback(
    (value) => {
      if (!title.trim()) {
        const site = extractSiteName(value);
        if (site) {
          setTitle(site.slice(0, MAX_TITLE));
        }
      }
    },
    [title]
  );

  const handleTitleChange = (e) => {
    const nextValue = e.target.value.slice(0, MAX_TITLE);
    setTitle(nextValue);
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLinkUrl(value);
    autoFillTitle(value);
  };

  const handlePost = () => {
    console.log({ title, linkUrl, selectedCommunity });
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="header-section">
          <h3>Create a post</h3>
          <hr className="header-divider" />
          <div className="community-picker">
            {!communityOpen ? (
              <button
                className="community-button"
                onClick={openCommunityInput}
                aria-haspopup="listbox"
                aria-expanded={communityOpen}
              >
                <span className="community-icon">
                  <i className="fas fa-users"></i>
                </span>
                <span>{selectedCommunity}</span>
                <span className={`arrow ${communityOpen ? "open" : ""}`} aria-hidden="true"></span>
              </button>
            ) : (
              <input
                className="community-input"
                value={communityInput}
                placeholder="Select a community"
                autoFocus
                onChange={(e) => setCommunityInput(e.target.value)}
                onBlur={handleCommunityCommit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCommunityCommit();
                  }
                  if (e.key === "Escape") {
                    setCommunityOpen(false);
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="post-form-card">
          <div className="form-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                className={`tab ${tab.path === location.pathname ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
                type="button"
              >
                <i className={tab.icon}></i> {tab.label}
              </button>
            ))}
          </div>

          <div className="inputs-wrapper">
            <Textbox placeholder="Title" value={title} onChange={handleTitleChange} />
            <div className="word-count" aria-live="polite">
              {titleCharCount}/{MAX_TITLE}
            </div>

            <Textbox
              placeholder="Link URL"
              value={linkUrl}
              onChange={handleLinkChange}
            />

            <div className="form-footer">
              <div className="action-buttons">
                <button className={`cancel-btn ${canPost ? "active" : ""}`} type="button">
                  Save Draft
                </button>
                <button
                  className={`post-btn ${canPost ? "active" : ""}`}
                  onClick={handlePost}
                  disabled={!canPost}
                  type="button"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Link;

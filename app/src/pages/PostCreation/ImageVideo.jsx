import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./postcreation.css";
import "./imagevideo.css";
import Textbox from "../../components/Global/textbox/textbox";

const TABS = [
  { icon: "fas fa-comment-alt", label: "Text", path: "/postcreation" },
  { icon: "fas fa-image", label: "Images & Video", path: "/postcreation/media" },
  { icon: "fas fa-link", label: "Link", path: "/postcreation/link" },
  { icon: "fas fa-poll", label: "Poll" },
];

const MAX_TITLE = 300;

function ImageVideo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("Select a community");
  const [communityInput, setCommunityInput] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const canPost = title.trim().length > 0 && mediaFiles.length > 0;
  const titleCharCount = title.length;
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
  const handleTitleChange = (e) => {
    const nextValue = e.target.value.slice(0, MAX_TITLE);
    setTitle(nextValue);
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const media = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    if (media.length) {
      setMediaFiles((prev) => [...prev, ...media]);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleMediaChange = (event) => {
    handleFiles(event.target.files);
  };

  const handlePost = () => {
    console.log({ title, mediaFiles, selectedCommunity });
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
            <button className="add-tag-btn" type="button">
              Add tags
            </button>

            <div
              className={`media-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
              />
              <label className="dropzone-inner" htmlFor="media-input">
                <i className="fas fa-cloud-upload-alt dropzone-icon" aria-hidden="true"></i>
                <p className="dropzone-title">Drag and drop images or videos</p>
                <p className="dropzone-hint">or click to browse from your device</p>
              </label>
              {mediaFiles.length > 0 && (
                <ul className="media-list">
                  {mediaFiles.map((file, idx) => (
                    <li key={`${file.name}-${idx}`} className="media-file-chip">
                      <span className="media-dot" aria-hidden="true"></span>
                      <span className="media-name">{file.name}</span>
                      <span className="media-size">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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

export default ImageVideo;

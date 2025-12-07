
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './postcreation.css';
import Textbox from '../../components/Global/textbox/textbox';

const COMMUNITIES = ['r/example', 'r/design', 'r/webdev'];
const TABS = [
  { icon: 'fas fa-comment-alt', label: 'Text', path: '/postcreation' },
  { icon: 'fas fa-image', label: 'Images & Video', path: '/postcreation/media' },
  { icon: 'fas fa-link', label: 'Link', path: '/postcreation/link' },
  { icon: 'fas fa-poll', label: 'Poll' },
];

const MAX_TITLE = 300;

function PostCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityOpen, setCommunityOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState('Select a community');
  const [communityInput, setCommunityInput] = useState('');
  const canPost = title.trim().length > 0 && content.trim().length > 0;
  const titleCharCount = title.length;
  const handleTabClick = (tab) => {
    if (tab.path) {
      navigate(tab.path);
    }
  };

  const handlePost = () => console.log({ title, content, selectedCommunity });
  const handleCommunityPick = (c) => {
    setSelectedCommunity(c);
    setCommunityOpen(false);
  };
  const openCommunityInput = () => {
    setCommunityInput(selectedCommunity === 'Select a community' ? '' : selectedCommunity);
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

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        
        <div className="header-section">
          <h3>Create a post</h3>
          <hr className="header-divider"/>
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
                <span className={`arrow ${communityOpen ? 'open' : ''}`} aria-hidden="true"></span>
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
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCommunityCommit();
                  }
                  if (e.key === 'Escape') {
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
                className={`tab ${tab.path === location.pathname ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
                type="button"
              >
                <i className={tab.icon}></i> {tab.label}
              </button>
            ))}
          </div>

          <div className="inputs-wrapper">
            <Textbox
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
            />
            <div className="word-count" aria-live="polite">
              {titleCharCount}/{MAX_TITLE}
            </div>
            <button className="add-tag-btn" type="button">Add tags</button>
            <textarea
              className="content-input"
              placeholder="Body text (optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <div className="form-footer">
              <div className="action-buttons">
                <button className={`cancel-btn ${canPost ? 'active' : ''}`}>Save Draft</button>
                <button 
                  className={`post-btn ${canPost ? 'active' : ''}`}
                  onClick={handlePost}
                  disabled={!canPost}
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

export default PostCreation;

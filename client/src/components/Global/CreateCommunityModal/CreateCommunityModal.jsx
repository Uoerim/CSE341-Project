import "./createCommunityModal.css";
import { useState } from "react";
import { uploadImage, getImageUrl } from "../../../services/uploadService";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOPICS = [
  { emoji: '🕹️', name: 'Gaming', tags: ['PC Gaming', 'Console Gaming', 'Mobile Gaming', 'Esports'] },
  { emoji: '🎬', name: 'Movies & TV', tags: ['Movies', 'TV Shows', 'Streaming', 'Reviews'] },
  { emoji: '🎵', name: 'Music', tags: ['Rock', 'Pop', 'Hip-Hop', 'Electronic'] },
  { emoji: '⚽', name: 'Sports', tags: ['Football', 'Basketball', 'Soccer', 'Baseball'] },
  { emoji: '💻', name: 'Technology', tags: ['Programming', 'AI', 'Hardware', 'Software'] },
  { emoji: '🎨', name: 'Art & Design', tags: ['Digital Art', 'Photography', 'Graphic Design', 'Drawing'] },
  { emoji: '📚', name: 'Books & Writing', tags: ['Fiction', 'Non-Fiction', 'Writing', 'Literature'] },
  { emoji: '🍔', name: 'Food & Cooking', tags: ['Recipes', 'Restaurants', 'Baking', 'Cooking Tips'] },
  { emoji: '✈️', name: 'Travel', tags: ['Travel Tips', 'Destinations', 'Adventure', 'Culture'] },
  { emoji: '🎮', name: 'Hobbies', tags: ['Collecting', 'DIY', 'Crafts', 'Gardening'] },
];

const COMMUNITY_TYPES = [
  {
    id: 'public',
    title: 'Public',
    description: 'Anyone can view, post, and comment in this community',
    icon: (
      <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
        <path d="M10 1c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9zm7.2 9c0 .27-.02.54-.05.8h-2.97c-.1 2.33-.63 4.38-1.41 5.84-.75.31-1.56.5-2.42.54.87-.53 2.06-2.85 2.22-6.38H7.41c.16 3.54 1.35 5.85 2.22 6.38a7 7 0 01-2.42-.54c-.78-1.46-1.31-3.52-1.41-5.84H2.83c-.03-.26-.05-.53-.05-.8s.02-.54.05-.8H5.8c.1-2.33.63-4.38 1.41-5.84.75-.31 1.56-.5 2.42-.54-.87.53-2.06 2.85-2.22 6.38h5.16c-.16-3.54-1.35-5.85-2.22-6.38a7 7 0 012.42.54c.78 1.46 1.31 3.52 1.41 5.84h2.97c.03.26.05.53.05.8z"></path>
      </svg>
    )
  },
  {
    id: 'restricted',
    title: 'Restricted',
    description: 'Anyone can view, but only approved users can contribute',
    icon: (
      <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
        <path d="M10 13.9c-2.15 0-3.9-1.75-3.9-3.9S7.85 6.1 10 6.1s3.9 1.75 3.9 3.9-1.75 3.9-3.9 3.9zm0-6a2.1 2.1 0 100 4.2 2.1 2.1 0 000-4.2z"></path>
        <path d="M10 16.97c-3.8 0-7.28-2.09-9.08-5.44-.51-.96-.51-2.1 0-3.06C2.72 5.11 6.2 3.03 10 3.03s7.28 2.09 9.08 5.44c.51.96.51 2.1 0 3.06-1.8 3.36-5.28 5.44-9.08 5.44zm0-12.14c-3.14 0-6.01 1.72-7.5 4.5-.22.42-.22.94 0 1.35a8.514 8.514 0 007.5 4.5c3.14 0 6.01-1.72 7.5-4.5.22-.42.22-.94 0-1.35a8.514 8.514 0 00-7.5-4.5z"></path>
      </svg>
    )
  },
  {
    id: 'private',
    title: 'Private',
    description: 'Only approved users can view and contribute',
    icon: (
      <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
        <path d="M15.995 8.168h-.429V6.61A5.573 5.573 0 0010 1.044 5.573 5.573 0 004.434 6.61v1.557h-.429A2.005 2.005 0 002 10.173v3.692a5.054 5.054 0 005.054 5.054h5.892A5.054 5.054 0 0018 13.865v-3.692a2.005 2.005 0 00-2.005-2.005zM6.233 6.61A3.771 3.771 0 0110 2.843a3.771 3.771 0 013.767 3.767v1.557H6.234V6.61h-.001zm9.967 7.254a3.258 3.258 0 01-3.254 3.254H7.054A3.258 3.258 0 013.8 13.864v-3.692c0-.113.092-.205.205-.205h11.991c.113 0 .205.092.205.205l-.001 3.692zm-7.1-1.676h1.8v2.809H9.1v-2.81z"></path>
      </svg>
    )
  }
];

export default function CreateCommunityModal({ onClose, onCommunityCreated }) {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [communityType, setCommunityType] = useState('public');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null);
  const [icon, setIcon] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateName = (value) => {
    if (value.length < 3) return 'Community name must be at least 3 characters';
    if (value.length > 21) return 'Community name must be less than 21 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Community name can only contain letters, numbers, and underscores';
    return '';
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else if (prev.length < 3) {
        return [...prev, topic];
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const canProceedFromStep = () => {
    switch (step) {
      case 1:
        return true; // Topics are optional
      case 2:
        return communityType !== '';
      case 3:
        return name && !validateName(name);
      case 4:
        return true; // Images are optional
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedFromStep()) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      
      // Upload banner and icon if provided
      let bannerUrl = null;
      let iconUrl = null;
      
      if (banner) {
        const bannerResult = await uploadImage(banner);
        // Construct full URL from the relative path returned by backend
        bannerUrl = `${apiUrl}${bannerResult.url.replace('/api', '')}`;
      }
      
      if (icon) {
        const iconResult = await uploadImage(icon);
        // Construct full URL from the relative path returned by backend
        iconUrl = `${apiUrl}${iconResult.url.replace('/api', '')}`;
      }
      
      const response = await fetch(`${apiUrl}/communities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          type: communityType,
          topics: selectedTopics,
          banner: bannerUrl,
          icon: iconUrl
        }),
      });

      if (response.ok) {
        const newCommunity = await response.json();
        onCommunityCreated(newCommunity);
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create community");
      }
    } catch (err) {
      console.error("Failed to create community:", err);
      setError('An error occurred while creating the community');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'banner') {
        setBanner(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setBannerPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setIcon(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setIconPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="create-community-overlay" onClick={onClose}>
      <div className="create-community-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="create-community-header">
          <h2>
            {step === 1 && 'Add topics'}
            {step === 2 && 'What kind of community is this?'}
            {step === 3 && 'Tell us about your community'}
            {step === 4 && 'Style your community'}
          </h2>
          <button className="create-community-close" onClick={onClose}>
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M15.5 5.5l-1-1-4.5 4.5-4.5-4.5-1 1 4.5 4.5-4.5 4.5 1 1 4.5-4.5 4.5 4.5 1-1-4.5-4.5z"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="create-community-content">
          {/* Step 1: Topics */}
          {step === 1 && (
            <div className="step-content">
              <p className="step-description">
                Add up to 3 topics to help interested users find your community.
              </p>
              <div className="topics-count">Topics {selectedTopics.length}/3</div>
              <div className="selected-topics">
                {selectedTopics.map(topic => (
                  <span key={topic} className="selected-topic-tag">
                    {topic}
                    <button onClick={() => toggleTopic(topic)}>✕</button>
                  </span>
                ))}
              </div>
              <div className="topics-grid">
                {TOPICS.map(category => (
                  <div key={category.name} className="topic-category">
                    <h4>
                      <span className="topic-emoji">{category.emoji}</span>
                      {category.name}
                    </h4>
                    <div className="topic-tags">
                      {category.tags.map(tag => (
                        <button
                          key={tag}
                          className={`topic-tag ${selectedTopics.includes(tag) ? 'selected' : ''}`}
                          onClick={() => toggleTopic(tag)}
                          disabled={!selectedTopics.includes(tag) && selectedTopics.length >= 3}
                        >
                          {tag}
                          {selectedTopics.includes(tag) && <span className="checkmark">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Community Type */}
          {step === 2 && (
            <div className="step-content">
              <p className="step-description">
                Decide who can view and contribute in your community. <strong>Important:</strong> Once set, you will need to submit a request to change your community type.
              </p>
              <div className="community-types">
                {COMMUNITY_TYPES.map(type => (
                  <label key={type.id} className={`community-type-option ${communityType === type.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="communityType"
                      value={type.id}
                      checked={communityType === type.id}
                      onChange={(e) => setCommunityType(e.target.value)}
                    />
                    <div className="type-content">
                      <div className="type-icon">{type.icon}</div>
                      <div className="type-info">
                        <h4>{type.title}</h4>
                        <p>{type.description}</p>
                      </div>
                      <div className="type-radio">
                        {communityType === type.id ? (
                          <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                            <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1z"></path>
                            <path d="M10 14a4 4 0 100-8 4 4 0 000 8z"></path>
                          </svg>
                        ) : (
                          <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                            <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Name & Description */}
          {step === 3 && (
            <div className="step-content">
              <p className="step-description">
                A name and description help people understand what your community is all about.
              </p>
              <div className="create-community-field">
                <label>Community name *</label>
                <div className="create-community-name-input">
                  <span className="create-community-prefix">r/</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="communityname"
                    maxLength={21}
                    required
                  />
                </div>
                <div className="create-community-hint">
                  {name.length}/21
                </div>
                {name && validateName(name) && (
                  <p className="validation-error">{validateName(name)}</p>
                )}
                <div className="create-community-info">
                  <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13a1 1 0 112 0v6a1 1 0 01-2 0V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  </svg>
                  <span>Community names cannot be changed once created</span>
                </div>
              </div>

              <div className="create-community-field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is your community about?"
                  maxLength={500}
                  rows={4}
                />
                <div className="create-community-hint">{description.length}/500</div>
              </div>

              <div className="preview-card">
                <div className="preview-icon">r/</div>
                <div className="preview-info">
                  <h4>r/{name || 'communityname'}</h4>
                  <p className="preview-meta">1 member · 1 online</p>
                  <p>{description || 'Your community description'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Styling */}
          {step === 4 && (
            <div className="step-content">
              <p className="step-description">
                Adding visual flair will catch new members attention and help establish your community's culture! You can update this at any time.
              </p>
              <div className="create-community-field">
                <label>Banner</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'banner')}
                    hidden
                  />
                  <label htmlFor="banner-upload" className="upload-button">
                    <span className="upload-icon">📷</span>
                    <span>{banner ? banner.name : 'Add'}</span>
                  </label>
                </div>
              </div>

              <div className="create-community-field">
                <label>Icon</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="icon-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'icon')}
                    hidden
                  />
                  <label htmlFor="icon-upload" className="upload-button">
                    <span className="upload-icon">📷</span>
                    <span>{icon ? icon.name : 'Add'}</span>
                  </label>
                </div>
              </div>

              <div className="preview-card large">
                <div className="preview-banner">
                  {bannerPreview && (
                    <>
                      <img src={bannerPreview} alt="" className="banner-blur-bg" />
                      <img src={bannerPreview} alt="" className="banner-main-img" />
                    </>
                  )}
                </div>
                <div className="preview-content">
                  <div className="preview-icon-large">
                    {iconPreview ? (
                      <img src={iconPreview} alt="" className="icon-preview-img" />
                    ) : (
                      <span>r/</span>
                    )}
                  </div>
                  <div className="preview-details">
                    <h3>r/{name || 'communityname'}</h3>
                    <p className="preview-meta">1 member · 1 online</p>
                    <p className="preview-desc">{description || 'Community description'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="create-community-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="create-community-footer">
          <div className="step-indicator">
            {[1, 2, 3, 4].map(s => (
              <span key={s} className={`step-dot ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}></span>
            ))}
          </div>
          <div className="modal-actions">
            <button className="create-community-cancel" onClick={step === 1 ? onClose : handleBack}>
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              className="create-community-create"
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={!canProceedFromStep() || loading}
            >
              {loading ? 'Creating...' : step === 4 ? 'Create Community' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

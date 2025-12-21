import "./avatarSelector.css";
import { useState, useEffect } from "react";
import { usePageNavigation } from "../../context/PageContext";

// List of available avatars - matches files in public/character/
const AVAILABLE_AVATARS = [
  { id: "char", name: "Classic Loopify", category: "Classic" },
  { id: "char-girl", name: "Loopify Girl", category: "Classic" },
  { id: "char-man-hoodie-gpgrad", name: "Hoodie Loopify", category: "Special" },
];

export default function AvatarSelector() {
  const [currentAvatar, setCurrentAvatar] = useState("char");
  const [selectedAvatar, setSelectedAvatar] = useState("char");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { onPageChange } = usePageNavigation();

  const token = localStorage.getItem("authToken");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // Fetch current user's avatar
    const fetchCurrentAvatar = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCurrentAvatar(data.avatar || "char");
        setSelectedAvatar(data.avatar || "char");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchCurrentAvatar();
  }, []);

  const handleSaveAvatar = async () => {
    if (selectedAvatar === currentAvatar) {
      // No change needed
      onPageChange("profile");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/users/me/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ avatar: selectedAvatar })
      });

      if (res.ok) {
        setCurrentAvatar(selectedAvatar);
        setSaveSuccess(true);
        setTimeout(() => {
          onPageChange("profile");
        }, 1000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
      alert("Failed to update avatar. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const groupedAvatars = AVAILABLE_AVATARS.reduce((acc, avatar) => {
    if (!acc[avatar.category]) {
      acc[avatar.category] = [];
    }
    acc[avatar.category].push(avatar);
    return acc;
  }, {});

  return (
    <div className="avatar-selector-page">
      <div className="avatar-selector-container">
        {/* Header */}
        <div className="avatar-selector-header">
          <button className="avatar-back-btn" onClick={() => onPageChange("profile")}>
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M12.793 2.293a1 1 0 011.414 1.414L7.414 10l6.793 6.293a1 1 0 01-1.414 1.414l-7.5-7a1 1 0 010-1.414l7.5-7z"></path>
            </svg>
          </button>
          <div className="avatar-header-content">
            <h1>Choose Your Avatar</h1>
            <p>Select an avatar to represent you across Loopify</p>
          </div>
        </div>

        {/* Current Avatar Preview */}
        <div className="avatar-preview-section">
          <div className="avatar-preview-card">
            <div className="avatar-preview-label">Current Selection</div>
            <div className="avatar-preview-image-wrapper">
              <img 
                src={`/character/${selectedAvatar}.png`} 
                alt="Selected avatar"
                className="avatar-preview-image"
              />
              {selectedAvatar !== currentAvatar && (
                <div className="avatar-preview-badge">New</div>
              )}
            </div>
            <div className="avatar-preview-name">
              {AVAILABLE_AVATARS.find(a => a.id === selectedAvatar)?.name || "Unknown"}
            </div>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="avatar-grid-section">
          {Object.entries(groupedAvatars).map(([category, avatars]) => (
            <div key={category} className="avatar-category">
              <h3 className="avatar-category-title">{category}</h3>
              <div className="avatar-grid">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''} ${currentAvatar === avatar.id ? 'current' : ''}`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <div className="avatar-option-image-wrapper">
                      <img 
                        src={`/character/${avatar.id}.png`} 
                        alt={avatar.name}
                        className="avatar-option-image"
                      />
                      {selectedAvatar === avatar.id && (
                        <div className="avatar-selected-check">
                          <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 11.172l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0z"></path>
                          </svg>
                        </div>
                      )}
                      {currentAvatar === avatar.id && selectedAvatar !== avatar.id && (
                        <div className="avatar-current-badge">In Use</div>
                      )}
                    </div>
                    <span className="avatar-option-name">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="avatar-actions">
          <button 
            className="avatar-cancel-btn" 
            onClick={() => onPageChange("profile")}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className={`avatar-save-btn ${saveSuccess ? 'success' : ''}`}
            onClick={handleSaveAvatar}
            disabled={saving || saveSuccess}
          >
            {saving ? (
              <>
                <span className="saving-spinner"></span>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 11.172l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0z"></path>
                </svg>
                Saved!
              </>
            ) : (
              "Save Avatar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import "./communitySelectorModal.css";
import { useState, useEffect } from "react";
import { apiGet } from "../../../utils/api";
import CreateCommunityModal from "../CreateCommunityModal/CreateCommunityModal";

export default function CommunitySelectorModal({ onClose, onSelect, selectedCommunity }) {
  const [communities, setCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await apiGet("/communities");
      setCommunities(data);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommunity = (community) => {
    onSelect(community);
    onClose();
  };

  const handleCommunityCreated = (newCommunity) => {
    setCommunities([newCommunity, ...communities]);
    onSelect(newCommunity);
    setShowCreateModal(false);
    onClose();
  };

  return (
    <>
      <div className="community-selector-overlay" onClick={onClose}>
        <div className="community-selector-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="community-selector-header">
          <h2>Choose a community</h2>
          <button className="community-selector-close" onClick={onClose}>
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M15.5 5.5l-1-1-4.5 4.5-4.5-4.5-1 1 4.5 4.5-4.5 4.5 1 1 4.5-4.5 4.5 4.5 1-1-4.5-4.5z"></path>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="community-selector-search">
          <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
            <path d="M19 17l-5.15-5.15a7 7 0 10-2 2L17 19zM3.5 8A4.5 4.5 0 118 12.5 4.5 4.5 0 013.5 8z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search communities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Communities List */}
        <div className="community-selector-list">
          {loading ? (
            <div className="community-selector-loading">Loading communities...</div>
          ) : filteredCommunities.length === 0 ? (
            <div className="community-selector-empty">
              <p>No communities found</p>
              {searchQuery && (
                <button className="community-selector-create-btn">
                  Create r/{searchQuery}
                </button>
              )}
            </div>
          ) : (
            filteredCommunities.map((community) => (
              <button
                key={community._id}
                className={`community-selector-item ${selectedCommunity?._id === community._id ? "selected" : ""}`}
                onClick={() => handleSelectCommunity(community)}
              >
                <div className="community-selector-item-icon">
                  <span>r/</span>
                </div>
                <div className="community-selector-item-info">
                  <div className="community-selector-item-name">r/{community.name}</div>
                  <div className="community-selector-item-members">
                    {community.members?.length || 0} members
                  </div>
                </div>
                {selectedCommunity?._id === community._id && (
                  <svg className="community-selector-check" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                    <path d="M7.5 14.5l-5-5 1.5-1.5 3.5 3.5 7-7 1.5 1.5z"></path>
                  </svg>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="community-selector-footer">
          <p>Can't find the community you're looking for?</p>
          <button className="community-selector-create-new" onClick={() => setShowCreateModal(true)}>
            Create New Community
          </button>
        </div>
      </div>
      </div>

      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      )}
    </>
  );
}

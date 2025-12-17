import "./communityPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/api";
import Post from "../../components/Post/Post";

export default function CommunityPage({ communityName: propName, embedded = false, onPostClick }) {
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sortBy, setSortBy] = useState("best");
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (!propName) return;

    setNotFound(false);
    setLoading(true);

    // Fetch community data
    apiGet(`/communities/r/${propName}`)
      .then((data) => {
        setCommunity(data);
        setMemberCount(data.members?.length || 0);
        // Check if current user is a member
        const currentUserId = localStorage.getItem("userId");
        setIsMember(data.members?.some(m => m._id === currentUserId || m === currentUserId) || false);
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          setNotFound(true);
        }
      });

    // Fetch community posts
    apiGet(`/communities/r/${propName}/posts`)
      .then((data) => {
        setPosts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [propName]);

  const handleJoinLeave = async () => {
    try {
      const endpoint = isMember 
        ? `/communities/${community._id}/leave`
        : `/communities/${community._id}/join`;
      
      await apiGet(endpoint);
      setIsMember(!isMember);
      setMemberCount(prev => isMember ? prev - 1 : prev + 1);
    } catch (error) {
      console.error("Failed to join/leave community:", error);
    }
  };

  const handlePostClick = (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    }
  };

  if (notFound) {
    return (
      <div className="community-page-not-found">
        <div className="community-page-not-found-content">
          <svg className="community-page-not-found-icon" fill="currentColor" height="80" width="80" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13a1 1 0 012 0v6a1 1 0 01-2 0V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
          <h2>Community Not Found</h2>
          <p>The community r/{propName} does not exist or has been removed.</p>
          <button className="community-page-not-found-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !community) {
    return <div className="community-page-loading">Loading community...</div>;
  }

  return (
    <div className="community-page">
      <main className="community-page-main">
        {/* Header */}
        <header className="community-page-header">
          <div className="community-page-banner"></div>
          <div className="community-page-header-content">
            <div className="community-page-header-left">
              <div className="community-page-icon">
                <span>r/</span>
              </div>
              <div className="community-page-title-section">
                <h1 className="community-page-title">r/{community.name}</h1>
                <div className="community-page-member-count">{memberCount.toLocaleString()} members</div>
              </div>
            </div>
            <div className="community-page-header-actions">
              <button className="community-page-bell-btn">
                <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                  <path d="M11 18a1 1 0 11-2 0 1 1 0 012 0zM9 3V1h2v2H9zm0 14v-1.5h2V17H9z"></path>
                  <path d="M17.61 15.84A1.5 1.5 0 0116.28 18H3.72a1.5 1.5 0 01-1.33-2.16A7.498 7.498 0 003.5 10V6a6.5 6.5 0 0113 0v4c0 2.03.82 3.88 1.11 5.84z"></path>
                </svg>
              </button>
              <button 
                className={`community-page-join-btn ${isMember ? "joined" : ""}`}
                onClick={handleJoinLeave}
              >
                {isMember ? "Joined" : "Join"}
              </button>
              <button className="community-page-mod-tools-btn">Mod Tools</button>
              <button className="community-page-more-btn">
                <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm4 2a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Sort Options */}
        <div className="community-page-sort-bar">
          <button 
            className={`community-page-sort-btn ${sortBy === "best" ? "active" : ""}`}
            onClick={() => setSortBy("best")}
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M10 20a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm1-8V6H9v4H5v2h4v4h2v-4h4v-2h-4z"></path>
            </svg>
            Best
          </button>
          <button 
            className={`community-page-sort-btn ${sortBy === "hot" ? "active" : ""}`}
            onClick={() => setSortBy("hot")}
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M10 0l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z"></path>
            </svg>
            Hot
          </button>
          <button 
            className={`community-page-sort-btn ${sortBy === "new" ? "active" : ""}`}
            onClick={() => setSortBy("new")}
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10V6h2v4h4v2h-4v4H8v-4H4v-2h4z"></path>
            </svg>
            New
          </button>
          <button 
            className={`community-page-sort-btn ${sortBy === "top" ? "active" : ""}`}
            onClick={() => setSortBy("top")}
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M10 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"></path>
            </svg>
            Top
          </button>
        </div>

        {/* Posts Section */}
        <section className="community-page-posts">
          {posts.length === 0 ? (
            <div className="community-page-empty-state">
              <div className="community-page-empty-icon">
                <svg fill="currentColor" height="80" width="80" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zM8 5a1 1 0 012 0v5a1 1 0 01-2 0V5zm1 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
              </div>
              <h2 className="community-page-empty-title">This community doesn't have any posts yet</h2>
              <p className="community-page-empty-subtitle">Make one and get this feed started.</p>
              <button className="community-page-empty-button">Create Post</button>
            </div>
          ) : (
            posts.map((post) => (
              <Post key={post._id} post={post} onPostClick={handlePostClick} />
            ))
          )}
        </section>
      </main>

      {/* Sidebar */}
      <aside className="community-page-sidebar">
        {/* About Community */}
        <div className="community-page-about-card">
          <h3 className="community-page-card-title">About Community</h3>
          <p className="community-page-description">
            {community.description || "This community doesn't have a description yet."}
          </p>
          <div className="community-page-stats">
            <div className="community-page-stat">
              <div className="community-page-stat-icon">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zM8 5a1 1 0 012 0v5a1 1 0 01-2 0V5zm1 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
              </div>
              <span>Created {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="community-page-stat">
              <div className="community-page-stat-icon">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M16 10a6 6 0 11-12 0 6 6 0 0112 0zm-6-4a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
              </div>
              <span>Public</span>
            </div>
          </div>
          <button className="community-page-guide-btn">+ Add a community guide</button>
        </div>

        {/* Moderators */}
        <div className="community-page-moderators-card">
          <h3 className="community-page-card-title">MODERATORS</h3>
          <button className="community-page-message-mods-btn">
            <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
              <path d="M18 2H2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM2 4h16v.5l-8 5-8-5V4zm0 12V7l8 5 8-5v9H2z"></path>
            </svg>
            Message Mods
          </button>
          <button className="community-page-invite-mod-btn">
            <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 15H9v-2h2v2zm0-4H9V5h2v6z"></path>
            </svg>
            Invite Mod
          </button>
          <div className="community-page-mod-list">
            <div className="community-page-mod-item">
              <img src="/character/char.png" alt="" className="community-page-mod-avatar" />
              <span>u/{community.creator?.username || "Unknown"}</span>
            </div>
          </div>
          <button className="community-page-view-all-mods">View all moderators</button>
        </div>

        {/* Community Settings */}
        <div className="community-page-settings-card">
          <h3 className="community-page-card-title">COMMUNITY SETTINGS</h3>
          <button className="community-page-setting-item">
            <span>Community Appearance</span>
            <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
              <path d="M8 5l5 5-5 5V5z"></path>
            </svg>
          </button>
          <button className="community-page-edit-widgets-btn">Edit Widgets</button>
        </div>
      </aside>
    </div>
  );
}

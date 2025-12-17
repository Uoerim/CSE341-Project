import "./userProfile.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/api";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Post from "../../components/Post/Post";
import ProfileComment from "../../components/Comment/ProfileComment";

export default function UserProfilePage({ username: propUsername, embedded = false, onPostClick }) {
  const { username: paramUsername } = useParams();
  const [currentUsername, setCurrentUsername] = useState(propUsername || paramUsername);
  const navigate = useNavigate();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelShifted, setIsPanelShifted] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [showBannerModal, setShowBannerModal] = useState(false);

  const mainContentRef = useRef(null);

  // Fetch current user's username if not provided
  useEffect(() => {
    if (currentUsername) return;
    
    apiGet("/users/me")
      .then((data) => {
        setCurrentUsername(data.username);
      })
      .catch(console.error);
  }, [currentUsername]);

  // Load profile header
  useEffect(() => {
    if (!currentUsername) return;
    
    setUserNotFound(false);
    apiGet(`/users/u/${currentUsername}/profile`)
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          setUserNotFound(true);
        }
      });
  }, [currentUsername]);

  // Load tab content
  useEffect(() => {
    if (!currentUsername) return;

    setLoading(true);
    const url = `/users/u/${currentUsername}/${tab}`;

    apiGet(url)
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUsername, tab]);

  useEffect(() => {
    mainContentRef.current?.scrollTo(0, 0);
  }, [currentUsername, tab]);

  const handlePostClick = (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    }
  };

  const formatRedditAge = (createdAt) => {
    const diffDays = Math.floor((Date.now() - new Date(createdAt)) / 86400000);
    if (diffDays < 30) return `${diffDays}d`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
    return `${Math.floor(diffDays / 365)}y`;
  };

  // Show user not found page
  if (userNotFound) {
    return (
      <div className="user-profile-not-found">
        <div className="user-profile-not-found-content">
          <svg className="user-profile-not-found-icon" fill="currentColor" height="80" width="80" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13a1 1 0 012 0v6a1 1 0 01-2 0V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
          <h2>User Not Found</h2>
          <p>The user u/{currentUsername} does not exist.</p>
          <button className="user-profile-not-found-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <div className="user-profile-loading">Loading profile...</div>;

  const tabs = ["overview", "posts", "comments", "saved", "history", "hidden", "upvoted", "downvoted"];

  const profileContent = (
    <>
      <div className="user-profile-page">
        {/* ================= MAIN ================= */}
        <main className="user-profile-main">
          {/* Profile Header */}
          <section className="user-profile-header-card">
            <div className="user-profile-user-row">
              <div className="user-profile-avatar clickable" onClick={() => setShowAvatarModal(true)}>
                <div className="user-profile-avatar-circle">
                  <img 
                    src={`/character/${user.avatar || 'char'}.png`} 
                    alt={user.username}
                    onError={(e) => {
                      e.target.src = '/character/char.png';
                    }}
                  />
                </div>
                <div className="user-profile-avatar-edit-badge">
                  <svg fill="currentColor" height="12" width="12" viewBox="0 0 20 20">
                    <path d="M18.85 3.15a2.89 2.89 0 00-4.08 0L3.46 14.46a.5.5 0 00-.12.2l-1.3 4.34a.5.5 0 00.63.63l4.34-1.3a.5.5 0 00.2-.12L18.52 6.9a2.89 2.89 0 00.33-4.08v.33zM5.83 17.52l-2.68.8.8-2.68L14.52 5.07l1.88 1.88-10.57 10.57zm12.1-12.1l-.83.83-1.88-1.88.83-.83a1.39 1.39 0 011.88 0 1.33 1.33 0 010 1.88z"></path>
                  </svg>
                </div>
              </div>
              <div className="user-profile-user-text">
                <h1 className="user-profile-display-name">{user.username}</h1>
                <p className="user-profile-handle">u/{user.username}</p>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="user-profile-tabs">
            {tabs.map((t) => (
              <button
                key={t}
                className={`user-profile-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts/Comments Content */}
          <section className="user-profile-content">
            {loading ? (
              <div className="user-profile-loading-content">
                <div className="user-profile-spinner"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="user-profile-empty-state">
                <div className="user-profile-empty-icon">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="45" r="35" fill="#fff"/>
                    <circle cx="50" cy="38" r="8" fill="#1a1a1b"/>
                    <ellipse cx="35" cy="45" rx="5" ry="8" fill="#ff4500"/>
                    <ellipse cx="65" cy="45" rx="5" ry="8" fill="#ff4500"/>
                    <path d="M 30 60 Q 50 70 70 60" stroke="#d7dadc" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="user-profile-empty-title">You don't have any {tab} yet</h2>
                <p className="user-profile-empty-subtitle">
                  Once you {tab === "posts" ? "post to a community" : tab === "comments" ? "comment on posts" : "vote on posts"}, it'll show up here. If you'd rather hide your {tab}, update your settings.
                </p>
                <button className="user-profile-empty-button">Update Settings</button>
              </div>
            ) : tab === "overview" ? (
              items.map((item) => {
                if (!item || !item.data) return null;
                return item.type === "post" ? (
                  <Post key={`post-${item.data._id}`} post={item.data} onPostClick={handlePostClick} />
                ) : (
                  <ProfileComment key={`comment-${item.data._id}`} comment={item.data} />
                );
              })
            ) : tab === "posts" || tab === "upvoted" || tab === "downvoted" || tab === "saved" || tab === "hidden" || tab === "history" ? (
              items.map((post) => (
                <Post key={post._id} post={post} onPostClick={handlePostClick} />
              ))
            ) : (
              items.map((comment) => (
                <ProfileComment key={comment._id} comment={comment} />
              ))
            )}
          </section>
        </main>

        {/* ================= SIDEBAR ================= */}
        <aside className="user-profile-sidebar">
          <div className="user-profile-side-card">
            {/* Banner */}
            <div
              className="user-profile-side-banner clickable"
              onClick={() => setShowBannerModal(true)}
              style={{
                backgroundImage: user.banner
                  ? `url(${user.banner})`
                  : "linear-gradient(180deg, #003f88, #001b3a)",
              }}
            >
              <div className="user-profile-banner-edit-icon">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M18.85 3.15a2.89 2.89 0 00-4.08 0L3.46 14.46a.5.5 0 00-.12.2l-1.3 4.34a.5.5 0 00.63.63l4.34-1.3a.5.5 0 00.2-.12L18.52 6.9a2.89 2.89 0 00.33-4.08v.33z"></path>
                </svg>
              </div>
            </div>

            {/* Sidebar Body */}
            <div className="user-profile-side-body">
              <h2 className="user-profile-side-username">{user.username}</h2>
              
              <button className="user-profile-share-btn">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M12.8 17.524l6.89-6.887a.9.9 0 000-1.273L12.8 2.477a1.64 1.64 0 00-1.782-.349 1.64 1.64 0 00-1.014 1.518v2.593C4.054 6.728 1.192 12.075 1 17.376a1.353 1.353 0 00.862 1.32 1.35 1.35 0 001.531-.364l.334-.381c1.705-1.944 3.323-3.791 6.277-4.103v2.509c0 .667.398 1.262 1.014 1.518a1.638 1.638 0 001.783-.349v-.002z"></path>
                </svg>
                <span>Share</span>
              </button>

              <p className="user-profile-followers">0 followers</p>

              {/* Stats Grid */}
              <div className="user-profile-stats-grid">
                <div className="user-profile-stat-item">
                  <strong>{stats?.totalKarma || 0}</strong>
                  <span>Karma</span>
                </div>
                <div className="user-profile-stat-item">
                  <strong>{(stats?.postCount || 0) + (stats?.commentCount || 0)}</strong>
                  <span>Contributions</span>
                </div>
                <div className="user-profile-stat-item">
                  <strong>{formatRedditAge(user.createdAt)}</strong>
                  <span>Reddit Age</span>
                </div>
                <div className="user-profile-stat-item">
                  <div className="user-profile-active-icons">
                    <span className="user-profile-community-count">2</span>
                  </div>
                  <span>Active in &gt;</span>
                </div>
                <div className="user-profile-stat-item">
                  <strong>0</strong>
                  <span>Gold earned</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ================= CHANGE AVATAR MODAL ================= */}
      {showAvatarModal && (
        <div className="user-profile-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="user-profile-avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-profile-avatar-modal-header">
              <h3>Avatar image</h3>
              <button className="user-profile-close-btn" onClick={() => setShowAvatarModal(false)}>
                ✕
              </button>
            </div>
            <div className="user-profile-avatar-modal-content">
              <div className="user-profile-avatar-option">
                <img src="/reddit-avatar-outline.png" alt="" />
                <button>Select avatar</button>
              </div>
              <div className="user-profile-avatar-option">
                <img src={`/character/${user.avatar || 'char'}.png`} alt="" />
                <button>
                  Select a new image
                  <span className="user-profile-upload-icon">⬆</span>
                </button>
              </div>
            </div>
            <div className="user-profile-avatar-modal-footer">
              <button onClick={() => setShowAvatarModal(false)}>Cancel</button>
              <button className="user-profile-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE BANNER MODAL ================= */}
      {showBannerModal && (
        <div className="user-profile-modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="user-profile-banner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-profile-avatar-modal-header">
              <h3>Banner image</h3>
              <button className="user-profile-close-btn" onClick={() => setShowBannerModal(false)}>
                ✕
              </button>
            </div>
            <div className="user-profile-banner-modal-content">
              <div className="user-profile-banner-dropzone">
                <div className="user-profile-drop-inner">
                  <div className="user-profile-drop-icon">⬆</div>
                  <div className="user-profile-drop-text">Drop file or</div>
                </div>
                <div className="user-profile-drop-footer">
                  <span>Formats: JPG, PNG</span>
                  <span>Max size: 500 KB</span>
                </div>
              </div>
            </div>
            <div className="user-profile-avatar-modal-footer">
              <button onClick={() => setShowBannerModal(false)}>Cancel</button>
              <button className="user-profile-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // If embedded, just return the profile content without the layout wrapper
  if (embedded) {
    return profileContent;
  }

  // Otherwise, render with full layout
  return (
    <div className="main-container">
      <MainNav onLogoClick={() => navigate("/")} />

      <div className="main-app-container">
        <MainSidePanel
          onToggle={setIsPanelShifted}
          onPageChange={() => {}}
          currentPage="home"
          isViewingPost={false}
        />

        <div
          ref={mainContentRef}
          className="main-content"
          style={{
            paddingLeft: isPanelShifted ? "100px" : "330px",
            transition: "padding-left 0.3s ease",
          }}
        >
          {profileContent}
        </div>
      </div>
    </div>
  );
}

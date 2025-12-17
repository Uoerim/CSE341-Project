import "./userProfile.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/api";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";

export default function UserProfilePage({ username: propUsername, embedded = false }) {
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
    apiGet(`/users/u/${currentUsername}/profile`)
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
      })
      .catch(console.error);
  }, [currentUsername]);

  // Load tab content
  useEffect(() => {
    if (!currentUsername) return;

    setLoading(true);
    const url =
      tab === "overview"
        ? `/users/u/${currentUsername}/overview`
        : `/users/u/${currentUsername}/${tab}`;

    apiGet(url)
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUsername, tab]);

  useEffect(() => {
    mainContentRef.current?.scrollTo(0, 0);
  }, [currentUsername, tab]);

  if (!user) return <div className="user-profile-loading">Loading profile...</div>;

  const profileContent = (
    <>
      <div className="user-profile-page">
        {/* ================= MAIN ================= */}
        <main className="user-profile-main">
          <section className="user-profile-header-card">
            <div className="user-profile-user-row">
              <div className="user-profile-avatar clickable" onClick={() => setShowAvatarModal(true)}>
                <div className="user-profile-avatar-circle">
                  {(user.avatarUrl || user.avatar) ? (
                    <img src={user.avatarUrl || user.avatar} alt=" " />
                  ) : (
                    <div className="user-profile-avatar-empty" />
                  )}
                </div>
              </div>
              <div className="user-profile-user-text">
                <h1 className="user-profile-username">u/{user.username}</h1>
                <p className="user-profile-meta">
                  {stats?.totalKarma || 0} karma • joined{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {user.bio && <p className="user-profile-bio">{user.bio}</p>}
          </section>

          <nav className="user-profile-tabs">
            {[
              "overview",
              "posts",
              "comments",
              "saved",
              "history",
              "hidden",
              "upvoted",
              "downvoted",
            ].map((t) => (
              <button
                key={t}
                className={`user-profile-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>

          <section className="user-profile-content">
            {loading ? (
              <p className="user-profile-empty">Loading...</p>
            ) : items.length === 0 ? (
              <p className="user-profile-empty">You don't have any posts yet</p>
            ) : tab === "overview" ? (
              items.map((item) =>
                item.type === "post" ? (
                  <ProfilePostCard key={item.data._id} post={item.data} />
                ) : (
                  <ProfileCommentCard key={item.data._id} comment={item.data} />
                )
              )
            ) : tab === "posts" ? (
              items.map((post) => <ProfilePostCard key={post._id} post={post} />)
            ) : (
              items.map((comment) => (
                <ProfileCommentCard key={comment._id} comment={comment} />
              ))
            )}
          </section>
        </main>

        {/* ================= SIDEBAR ================= */}
        <aside className="user-profile-sidebar">
          <div className="user-profile-reddit-side-card dark">
            <div
              className="user-profile-reddit-side-banner clickable"
              onClick={() => setShowBannerModal(true)}
              style={{
                backgroundImage: user.banner
                  ? `url(${user.banner})`
                  : "linear-gradient(180deg, #003f88, #001b3a)",
              }}
            >
              <span className="user-profile-edit-banner-text">Edit banner</span>
            </div>
            <div className="user-profile-reddit-side-body">
              <h2 className="user-profile-reddit-side-username">{user.username}</h2>
              <button className="user-profile-reddit-share-btn">Share</button>
              <p className="user-profile-reddit-followers">0 followers</p>
              <div className="user-profile-reddit-stats-grid">
                <div>
                  <strong>{stats?.totalKarma || 0}</strong>
                  <span>Karma</span>
                </div>
                <div>
                  <strong>{stats?.contributions || 0}</strong>
                  <span>Contributions</span>
                </div>
                <div>
                  <strong>
                    {Math.floor((Date.now() - new Date(user.createdAt)) / 86400000)} d
                  </strong>
                  <span>Reddit Age</span>
                </div>
                <div className="user-profile-active-in">
                  <strong>0</strong>
                  <span>Active in &gt;</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>Gold earned</span>
                </div>
              </div>
              <div className="user-profile-reddit-divider" />
              <div className="user-profile-reddit-achievements">
                <h4>ACHIEVEMENTS</h4>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ================= CHANGE AVATAR ================= */}
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
                <img src={user.avatarUrl || user.avatar || "/default-avatar.png"} alt="" />
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

      {/* ================= CHANGE BANNER ================= */}
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

/* ================= Cards ================= */
function ProfilePostCard({ post }) {
  return (
    <article className="user-profile-post-card">
      <div className="user-profile-post-meta">{post.community && <span>r/{post.community.name}</span>}</div>
      <h3>{post.title}</h3>
      {post.content && <p>{post.content}</p>}
    </article>
  );
}

function ProfileCommentCard({ comment }) {
  return (
    <article className="user-profile-comment-card">
      <div className="user-profile-post-meta">{comment.post?.title && <span>Comment on: {comment.post.title}</span>}</div>
      <p>{comment.content}</p>
    </article>
  );
}

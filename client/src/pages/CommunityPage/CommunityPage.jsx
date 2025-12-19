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
      {/* Banner */}
      <div className="community-page-banner">
        <div className="community-page-banner-text">{community.name}</div>
      </div>

      {/* Header Bar */}
      <div className="community-page-header">
        <div className="community-page-header-container">
          <div className="community-page-header-left">
            <div className="community-page-icon">
              {community.icon ? (
                <img src={community.icon} alt="" />
              ) : (
                <div className="community-page-icon-placeholder">r/</div>
              )}
            </div>
            <h1 className="community-page-title">
              r/{community.name}
              <span className="community-page-emoji">🦆</span>
            </h1>
          </div>
          <div className="community-page-header-actions">
            <button className="community-page-create-post-btn">
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                <path d="M19 9h-8V1a1 1 0 00-2 0v8H1a1 1 0 000 2h8v8a1 1 0 002 0v-8h8a1 1 0 000-2z"></path>
              </svg>
              Create Post
            </button>
            <button className="community-page-bell-btn">
              <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                <path d="M10 20a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0010 20zm7.5-5.5l-1.25-1.5V8.75a6.25 6.25 0 10-12.5 0v4.25L2.5 14.5V16h15v-1.5z"></path>
              </svg>
            </button>
            <button 
              className={`community-page-join-btn ${isMember ? "joined" : ""}`}
              onClick={handleJoinLeave}
            >
              {isMember ? "Joined" : "Join"}
            </button>
            <button className="community-page-more-btn">
              <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm4 2a2 2 0 100-4 2 2 0 000 4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="community-page-content">
        <main className="community-page-main">
          {/* Sort Options */}
          <div className="community-page-sort-bar">
            <button className="community-page-sort-dropdown-btn">
              Best
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </button>
            <div className="community-page-view-toggle">
              <button className="community-page-view-btn active">
                <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                  <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z"></path>
                </svg>
              </button>
              <button className="community-page-view-btn">
                <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                  <path d="M14 8l-4 4-4-4h8z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Community Highlights */}
          <div className="community-highlights">
            <div className="community-highlights-toggle">
              <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20" className="star-icon">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"></path>
              </svg>
              <span>Community highlights</span>
              <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20" className="dropdown-arrow">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
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
            <h3 className="community-page-card-title">{community.name}</h3>
            <p className="community-page-description">
              {community.description || "Play Reddit Games here! Join our discord community for discussions and events :)"}
            </p>
            <div className="community-page-meta">
              <div className="community-page-meta-item">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M7 2a5 5 0 00-5 5v6a5 5 0 005 5h6a5 5 0 005-5V7a5 5 0 00-5-5H7zm0 2h6a3 3 0 013 3v6a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm3 2a1 1 0 100 2 1 1 0 000-2z"></path>
                </svg>
                <span>Created {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="community-page-meta-item">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z"></path>
                </svg>
                <span>Public</span>
              </div>
            </div>
            <div className="community-page-stats">
              <div className="community-page-stat">
                <div className="community-page-stat-number">{memberCount > 1000 ? `${Math.floor(memberCount / 1000)}K` : memberCount}</div>
                <div className="community-page-stat-label">Gamers</div>
              </div>
              <div className="community-page-stat">
                <div className="community-page-stat-number">50K</div>
                <div className="community-page-stat-label-online">Playing</div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="community-page-rules-card">
            <h3 className="community-page-rules-title">R/{community.name.toUpperCase()} RULES</h3>
            <div className="community-page-rule">
              <span className="rule-number">1</span>
              <span className="rule-text">No offensive content</span>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20" className="rule-expand">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
            <div className="community-page-rule">
              <span className="rule-number">2</span>
              <span className="rule-text">No low-effort slop (including "free win" or "try to lose" levels)</span>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20" className="rule-expand">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
            <div className="community-page-rule">
              <span className="rule-number">3</span>
              <span className="rule-text">No Tip or Upvote begging in post title</span>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20" className="rule-expand">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
            <div className="community-page-rule">
              <span className="rule-number">4</span>
              <span className="rule-text">Do not steal/repost other levels.</span>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20" className="rule-expand">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
            <div className="community-page-rule">
              <span className="rule-number">5</span>
              <span className="rule-text">Do not share games that aren't playable on Reddit.</span>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20" className="rule-expand">
                <path d="M14 8l-4 4-4-4h8z"></path>
              </svg>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

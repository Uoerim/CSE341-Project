import "./userProfile.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../utils/api";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";

export default function UserProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelShifted, setIsPanelShifted] = useState(false);

  const mainContentRef = useRef(null);

  /* ================= Load profile header ================= */
  useEffect(() => {
    if (!username) return;

    apiGet(`/users/u/${username}/profile`)
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
      })
      .catch(console.error);
  }, [username]);

  /* ================= Load tab content ================= */
  useEffect(() => {
    if (!username) return;

    setLoading(true);

    let url = `/users/u/${username}/overview`;
    if (tab !== "overview") {
      url = `/users/u/${username}/${tab}`;
    }

    apiGet(url)
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username, tab]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [username, tab]);

  if (!user) return <div>Loading profile…</div>;

  return (
    <div className="main-container">
      <MainNav />

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
          <div className="profile-page">
            {/* ================= MAIN COLUMN ================= */}
            <main className="profile-main">
              <section className="profile-header-card">
                <div className="profile-banner" />

                <div className="profile-header-body">
                  <div className="profile-avatar-wrapper">
                    <div className="profile-avatar" />
                  </div>

                  <h1 className="profile-username">
                    u/{user.username}
                  </h1>

                  <p className="profile-meta">
                    {stats?.totalKarma || 0} karma • joined{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>

                  {user.bio && (
                    <p className="profile-bio">{user.bio}</p>
                  )}
                </div>
              </section>

              <nav className="profile-tabs">
                {[
                  "overview",
                  "posts",
                  "comments",
                  "saved",
                  "history",
                  "hidden",
                  "upvoted",
                ].map((t) => (
                  <button
                    key={t}
                    className={`profile-tab ${
                      tab === t ? "active" : ""
                    }`}
                    onClick={() => setTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </nav>

              <section className="profile-content">
                {loading ? (
                  <p className="profile-empty">Loading…</p>
                ) : items.length === 0 ? (
                  <p className="profile-empty">
                    You don’t have any posts yet
                  </p>
                ) : tab === "overview" ? (
                  items.map((item) =>
                    item.type === "post" ? (
                      <ProfilePostCard
                        key={item.data._id}
                        post={item.data}
                      />
                    ) : (
                      <ProfileCommentCard
                        key={item.data._id}
                        comment={item.data}
                      />
                    )
                  )
                ) : tab === "posts" ? (
                  items.map((post) => (
                    <ProfilePostCard key={post._id} post={post} />
                  ))
                ) : (
                  items.map((comment) => (
                    <ProfileCommentCard
                      key={comment._id}
                      comment={comment}
                    />
                  ))
                )}
              </section>
            </main>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="profile-sidebar">
              <div className="reddit-side-card dark">
                <div className="reddit-side-banner">
                  <button className="reddit-banner-edit"></button>
                </div>

                <div className="reddit-side-body">
                  <h2 className="reddit-side-username">
                    {user.username}
                  </h2>

                  <button className="reddit-share-btn">
                    Share
                  </button>

                  <p className="reddit-followers">
                    0 followers
                  </p>

                  <div className="reddit-stats-grid">
                    <div>
                      <strong>{stats?.totalKarma || 0}</strong>
                      <span>Karma</span>
                    </div>
                    <div>
                      <strong>
                        {stats?.contributions || 0}
                      </strong>
                      <span>Contributions</span>
                    </div>
                    <div>
                      <strong>
                        {Math.floor(
                          (Date.now() -
                            new Date(user.createdAt)) /
                            86400000
                        )}{" "}
                        d
                      </strong>
                      <span>Reddit Age</span>
                    </div>
                    <div className="active-in">
                      <strong>0</strong>
                      <span>Active in &gt;</span>
                    </div>
                    <div>
                      <strong>0</strong>
                      <span>Gold earned</span>
                    </div>
                  </div>

                  <div className="reddit-divider" />

                  <div className="reddit-achievements">
                    <h4>ACHIEVEMENTS</h4>
                    {/* intentionally empty */}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Post Card ================= */
function ProfilePostCard({ post }) {
  return (
    <article className="profile-post-card">
      <div className="profile-post-meta">
        {post.community && (
          <span>r/{post.community.name}</span>
        )}
      </div>
      <h3>{post.title}</h3>
      {post.content && <p>{post.content}</p>}
    </article>
  );
}

/* ================= Comment Card ================= */
function ProfileCommentCard({ comment }) {
  return (
    <article className="profile-comment-card">
      <div className="profile-post-meta">
        {comment.post?.title && (
          <span>
            Comment on: {comment.post.title}
          </span>
        )}
      </div>
      <p>{comment.content}</p>
    </article>
  );
}

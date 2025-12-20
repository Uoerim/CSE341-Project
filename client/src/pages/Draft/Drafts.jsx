import React, { useEffect, useState } from "react";
import "./Drafts.css";

function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePublish = async (draftId) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`http://localhost:5000/api/posts/${draftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "published",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to publish draft");
      }

      // شيل الدرفت من الليست
      setDrafts((prev) => prev.filter((d) => d._id !== draftId));

      alert("✅ Draft posted successfully!");
    } catch (e) {
      alert("❌ " + e.message);
    }
  };


  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          "http://localhost:5000/api/posts/user/drafts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch drafts");
        }

        const data = await res.json();
        setDrafts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const stripHtml = (html = "") =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const handleEdit = (id) => {
    // غير URL من غير reload
    window.history.pushState({}, "", `/app?edit=${id}`);
    // خلي Main يحس بالتغيير
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="drafts-page">
      <div className="drafts-container">
        <div className="drafts-header">
          <h1 className="draft-title">Drafts</h1>
          <p className="draft-description">
            Save up to 20 comment and 20 post drafts without media.
          </p>
        </div>

        <div className="draft-cards">
          {loading && <p className="empty-subtitle">Loading...</p>}
          {error && <p className="empty-subtitle">{error}</p>}

          {!loading && !error && drafts.length === 0 && (
            <div className="empty-state">
              <p className="empty-title">
                Don’t lose your hard work — save it as a draft
              </p>
              <p className="empty-subtitle">
                When you save a draft, it’ll show up here so you can edit and
                submit it later.
              </p>
            </div>
          )}

          {!loading && !error && drafts.length > 0 && (
            <div className="drafts-list">
              {drafts.map((d) => (
                <div key={d._id} className="draft-item">
                  <div className="draft-info">
                    <h3 className="draft-item-title">{d.title}</h3>

                    <p className="draft-item-snippet">
                      {stripHtml(d.content).slice(0, 120)}
                      {stripHtml(d.content).length > 120 ? "..." : ""}
                    </p>

                    <small className="draft-item-meta">
                      {new Date(
                        d.updatedAt || d.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>

                  <div className="draft-actions">
                    <button
                      className="btn-draft primary"
                      onClick={() => handleEdit(d._id)}
                    >
                      Edit
                    </button>

                    <button className="btn-draft" onClick={() => handlePublish(d._id)}>
                      Post
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drafts;

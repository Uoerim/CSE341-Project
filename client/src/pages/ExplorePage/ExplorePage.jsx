import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";
import "./ExplorePage.css";

const TABS = [
  "All",
  "Most Visited",
  "Internet Culture",
  "Games",
  "Q&As & Stories",
  "Movies & TV",
  "Technology",
  "Pop Culture",
  "Places & Travel",
  "Sports",
];

function ExplorePage() {
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch sections for the active tab
  useEffect(() => {
    apiGet(`/explore/sections/${activeTab}`)
      .then(setSections)
      .catch(console.error);
  }, [activeTab]);

  return (
    <div className="explore-root">
      <div className="explore-container">
        <h1 className="explore-title">Explore Communities</h1>

        {/* Tabs */}
        <div className="explore-tabs-scroll">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              className={`explore-tab ${
                index === 0 ? "explore-tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, "-"))}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.id} className="explore-section">
            <h2 className="explore-section-title">{section.title}</h2>

            <div className="explore-cards-grid">
              {section.communities.map((c) => (
                <div key={c.id} className="explore-card">
                  <a href={`/r/${c.name}`} className="explore-card-overlay" />

                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="explore-card-avatar"
                  />

                  <div className="explore-card-content">
                    <p className="explore-card-name">r/{c.name}</p>
                    <p className="explore-card-visitors">
                      {c.members.toLocaleString()} members
                    </p>
                    <p className="explore-card-description">{c.description}</p>
                  </div>

                  <button className="explore-join-btn">Join</button>
                </div>
              ))}
            </div>

            <div className="explore-show-more">
              <button>Show more</button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default ExplorePage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";

function Sidebar() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/communities");
        setCommunities(res.data || []);
      } catch (err) {
        console.error("Failed to load communities", err);
      }
    };
    load();
  }, []);

  return (
    <aside
      style={{
        width: "260px",
        borderLeft: "1px solid #eee",
        paddingLeft: "12px",
      }}
    >
      <h4>Communities</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {communities.map((c) => (
          <li key={c._id} style={{ marginBottom: 4 }}>
            <Link to={`/r/${c._id}`}>r/{c.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

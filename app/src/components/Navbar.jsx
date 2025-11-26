import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        justifyContent: "space-between",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <strong>Reddit Clone</strong>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, margin: "0 16px" }}>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </form>

      <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link to="/login">Log in</Link>
        <Link to="/register">Sign up</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </header>
  );
}

export default Navbar;

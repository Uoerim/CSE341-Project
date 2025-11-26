import React from "react";
import { NavLink } from "react-router-dom";

const container = {
  width: "220px",
  paddingRight: "12px",
  borderRight: "1px solid #eee",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const itemStyle = {
  marginBottom: 6,
};

function linkStyle(isActive) {
  return {
    display: "block",
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14,
    color: isActive ? "#fff" : "#222",
    backgroundColor: isActive ? "#1a73e8" : "transparent",
  };
}

function LeftNav() {
  return (
    <nav style={container}>
      <ul style={listStyle}>
        <li style={itemStyle}>
          <NavLink
            to="/"
            style={({ isActive }) => linkStyle(isActive)}
          >
            Home
          </NavLink>
        </li>
        <li style={itemStyle}>
          <NavLink
            to="/popular"
            style={({ isActive }) => linkStyle(isActive)}
          >
            Popular
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNav;

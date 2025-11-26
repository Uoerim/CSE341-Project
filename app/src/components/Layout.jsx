import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LeftNav from "./LeftNav";

const layoutStyles = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const mainStyles = {
  display: "flex",
  flex: 1,
  maxWidth: "1100px",
  width: "100%",
  margin: "0 auto",
  padding: "16px",
  gap: "16px",
};

const contentStyles = {
  flex: 1,
};

function Layout({ children }) {
  return (
    <div style={layoutStyles}>
      <Navbar />
      <div style={mainStyles}>
        {/* LEFT MENU */}
        <LeftNav />

        {/* CENTER CONTENT */}
        <div style={contentStyles}>{children}</div>

        {/* RIGHT SIDEBAR */}
        <Sidebar />
      </div>
    </div>
  );
}

export default Layout;

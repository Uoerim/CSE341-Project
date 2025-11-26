import React from "react";
import "./Settings.css";

function SettingsSection({ title, children }) {
  return (
    <section className="settings-section">
      <h2 className="settings-section-title">{title}</h2>
      {children}
    </section>
  );
}

export default SettingsSection;

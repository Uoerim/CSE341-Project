import React from "react";
import "./Settings.css";

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  );
}

export default ToggleSwitch;

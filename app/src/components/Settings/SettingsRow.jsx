import React from "react";
import "./Settings.css";

function SettingsRow({
  label,
  value,
  helper,
  action,
  actionType = "default",
  onClick,
  valueClassName,
}) {
  const clickable = !!onClick;

  return (
    <div
      className={
        "settings-row" + (clickable ? " settings-row--clickable" : "")
      }
      onClick={onClick}
    >
      <div className="settings-row-left">
        <div className="settings-row-label">{label}</div>
        {helper && <div className="settings-row-helper">{helper}</div>}
      </div>

      <div className="settings-row-right">
        {value && (
          <span
            className={
              "settings-row-value" +
              (valueClassName ? " " + valueClassName : "")
            }
          >
            {value}
          </span>
        )}

        {action &&
          (typeof action === "string" ? (
            actionType === "chevron" ? (
              <button className="settings-row-chevron" type="button">
                <span className="settings-row-chevron-icon">›</span>
              </button>
            ) : (
              <button
                type="button"
                className={
                  actionType === "primary"
                    ? "settings-row-button settings-row-button--primary"
                    : "settings-row-button"
                }
              >
                {action}
              </button>
            )
          ) : (
            action
          ))}
      </div>
    </div>
  );
}

export default SettingsRow;

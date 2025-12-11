// CountryCodeSelector.jsx
import React, { useState, useRef, useEffect } from "react";
import { countryCodes } from "./countryCodes";
import "./CountryCodeSelector.css";

export default function CountryCodeSelector({ selectedCode, setSelectedCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setSelectedCode(code);
    setIsOpen(false);
  };

  return (
    <div className="country-code-selector" ref={dropdownRef}>
      <button
        className="country-pill-button"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)} // toggle dropdown
      >
        <span className="country-pill-text">
    <span className="country-pill-flag">{selectedCode.flagEmoji}</span>
    <span className="country-pill-code">{selectedCode.code}</span>
        </span>
        <span className="country-pill-dropdown-icon">
          <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="country-dropdown">
          {countryCodes.map((code) => (
            <div
            key={code.countryCode}
            className="country-dropdown-item"
            onClick={() => handleSelect(code)}
            >
            <div className="country-dropdown-item-left">
                <span className="country-dropdown-flag">{code.flagEmoji}</span>
                <div className="country-dropdown-text">
                <span className="country-name-code">{code.countryName} {code.code}</span>
                <span className="country-extra">{/* optional subtitle */}</span>
                </div>
            </div>
            <div className="country-dropdown-item-right">
                {/* optional icon or indicator */}
            </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}

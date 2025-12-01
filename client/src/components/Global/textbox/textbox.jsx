import React from "react";
import './textbox.css';

function Textbox({ placeholder, type = "text", value, onChange, showCheckmark = true, error = false }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && !showPassword ? "password" : "text";
    const hasValue = value && value.length > 0;

    return (
        <div className="textbox-wrapper">
            <label className={`floating-label ${isFocused || value ? 'active' : ''}`}>
                {placeholder}
                <span>&nbsp;*</span>
            </label>
            <div className="input-container">
                <input
                    className={`global-textbox ${error ? 'error' : ''}`}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {error && hasValue && (
                    <svg className="error-icon" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path></svg>
                )}
                {hasValue && isPassword && isFocused && (
                    <button
                        className={`password-toggle ${error ? 'with-error' : ''}`}
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        type="button"
                    >
                        {showPassword ? (
                            <svg key="show" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        ) : (
                            <svg key="hide" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        )}
                    </button>
                )}
                {hasValue && !isPassword && !isFocused && showCheckmark && (
                    <svg className="checkmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
                {hasValue && isPassword && !isFocused && showCheckmark && (
                    <svg className="checkmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </div>
        </div>
    );
}

export default Textbox;
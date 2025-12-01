import React from "react";
import './registerCredentials.css';
import Textbox from "../../Global/textbox/textbox";
import { checkUsername } from "../../../services";

function RegisterCredentials({ username, setUsername, password, setPassword, onBack }) {
    const [usernameError, setUsernameError] = React.useState("");
    const [passwordErrors, setPasswordErrors] = React.useState([]);
    const [checkingUsername, setCheckingUsername] = React.useState(false);

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 12) {
            errors.push("At least 12 characters");
        }
        if (!/[a-zA-Z]/.test(pwd)) {
            errors.push("At least one letter");
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
            errors.push("At least one special character");
        }
        return errors;
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value.replace(/\s/g, '');
        setPassword(pwd);
        if (pwd) {
            setPasswordErrors(validatePassword(pwd));
        } else {
            setPasswordErrors([]);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        
        if (value.length >= 4) {
            checkUsernameAvailability(value);
        } else if (value.length > 0) {
            setUsernameError("Username must be at least 4 characters");
        } else {
            setUsernameError("");
        }
    };

    const checkUsernameAvailability = async (uname) => {
        setCheckingUsername(true);
        try {
            const data = await checkUsername(uname);
            if (data.exists) {
                setUsernameError("Username already taken");
            } else {
                setUsernameError("Nice! Username available");
            }
        } catch (error) {
            console.error("Error checking username:", error);
            setUsernameError("");
        } finally {
            setCheckingUsername(false);
        }
    };

    const isPasswordValid = password.length > 0 && passwordErrors.length === 0;

    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && username && isPasswordValid) {
                const continueButton = document.querySelector('[data-credentials-continue]');
                if (continueButton) {
                    continueButton.click();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [username, isPasswordValid]);

    return (
        <div className="register-credentials-container">
            <div className="register-credentials-header">

            </div>
            <h1>Create your username and password</h1>
            <p>Loopify is anonymous, so your username is what you'll go by here. Choose wisely—because once you get a name, you can't change it.</p>
            <div className="register-credentials-inputs">
                <div className="input-field">
                    <Textbox 
                        placeholder="Username" 
                        type="text" 
                        value={username} 
                        onChange={handleUsernameChange}
                        showCheckmark={false}
                        error={usernameError === "Username already taken" || usernameError === "Username must be at least 4 characters" ? true : false}
                    />
                    {checkingUsername && <p className="checking-message">Checking availability...</p>}
                    {usernameError && usernameError === "Nice! Username available" && (
                        <p className="username-success">{usernameError}</p>
                    )}
                    {usernameError && usernameError !== "Nice! Username available" && (
                        <p className="username-error">{usernameError}</p>
                    )}
                    {usernameError === "Nice! Username available" && !checkingUsername && (
                        <svg className="valid-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
                <div className="input-field">
                    <Textbox 
                        placeholder="Password" 
                        type="password" 
                        value={password} 
                        onChange={handlePasswordChange}
                        showCheckmark={false}
                        error={password.length > 0 && passwordErrors.length > 0 ? true : false}
                    />
                    {password && (
                        <div className="password-requirements">
                            <p className={passwordErrors.length === 0 ? "requirement-met" : "requirement-unmet"}>
                                ✓ Password strength requirements:
                            </p>
                            <ul>
                                <li className={password.length >= 12 ? "met" : "unmet"}>
                                    At least 12 characters ({password.length}/12)
                                </li>
                                <li className={/[a-zA-Z]/.test(password) ? "met" : "unmet"}>
                                    At least one letter
                                </li>
                                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "met" : "unmet"}>
                                    At least one special character
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterCredentials;

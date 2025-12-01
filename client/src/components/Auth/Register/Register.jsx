import React from "react";
import './register.css';
import Textbox from "../../Global/textbox/textbox";
import { checkEmail } from "../../../services";

function Register({ email, setEmail }) {
    const [emailError, setEmailError] = React.useState("");
    const [checkingEmail, setCheckingEmail] = React.useState(false);

    const isValidEmail = (emailValue) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value.length > 0 && isValidEmail(value)) {
            checkEmailAvailability(value);
        } else if (value.length > 0) {
            setEmailError("Please enter a valid email");
        } else {
            setEmailError("");
        }
    };

    const checkEmailAvailability = async (emailValue) => {
        setCheckingEmail(true);
        try {
            const data = await checkEmail(emailValue);
            if (data.exists) {
                setEmailError("Email already registered");
            } else {
                setEmailError("");
            }
        } catch (error) {
            console.error("Error checking email:", error);
            setEmailError("");
        } finally {
            setCheckingEmail(false);
        }
    };

    const isValid = email.length > 0 && isValidEmail(email) && emailError === "";

    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && isValid) {
                // Parent component will handle continue action
                const continueButton = document.querySelector('[data-register-continue]');
                if (continueButton) {
                    continueButton.click();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isValid]);

    return (
        <div className="register-container">
            <h1>Sign Up</h1>
            <p>By continuing, you agree to our <span>User Agreement</span> and acknowledge that you understand the <span>Privacy Policy</span>.</p>
            <div className="register-external-container">
                <div className="register-button-placeholder">Placeholder</div>
                <div className="register-button-placeholder">Placeholder</div>
                <div className="register-button-placeholder">Placeholder</div>

            </div>
            <div className="register-or-container"><hr /><div>OR</div></div>
            <div className="register-email-container">
                <div className="email-input-wrapper">
                    <Textbox 
                        placeholder="Email" 
                        type="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        showCheckmark={false}
                        error={emailError === "Please enter a valid email" || emailError === "Email already registered" ? true : false}
                    />
                    {!checkingEmail && emailError === "" && email.length > 0 && isValidEmail(email) && (
                        <svg className="email-status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
                {checkingEmail && <p className="checking-message">Checking availability...</p>}
                {emailError && emailError !== "" && (
                    <p className="email-error-message">{emailError}</p>
                )}
            </div>
        </div>
    );
}

export default Register;
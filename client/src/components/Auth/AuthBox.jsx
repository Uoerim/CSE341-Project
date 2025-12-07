import React from "react";
import "./authBox.css";
import Login from "./Login/Login";
import Register from "./Register/Register";
import RegisterCredentials from "./Register/RegisterCredentials";
import RegisterAboutYou from "./Register/RegisterAboutYou";
import Spinner from "../Global/Spinner/Spinner";
import { registerUser, setToken, googleAuthenticate, completeGoogleRegistration } from "../../services";
import { useNavigate } from "react-router-dom";

function AuthBox() {
    const navigate = useNavigate();
    const loginRef = React.useRef();
    const [authOption, setAuthOption] = React.useState(0);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [registerEmail, setRegisterEmail] = React.useState("");
    const [registerStage, setRegisterStage] = React.useState(0);
    const [username, setUsername] = React.useState("");
    const [registerPassword, setRegisterPassword] = React.useState("");
    const [gender, setGender] = React.useState("prefer not to say");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [loginLoading, setLoginLoading] = React.useState(false);
    
    // Google auth flow state
    const [googleIdToken, setGoogleIdToken] = React.useState("");
    const [isGoogleFlow, setIsGoogleFlow] = React.useState(false);
    const [googleUserEmail, setGoogleUserEmail] = React.useState("");
    
    const isLoginDisabled = !email || !password;

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Handle Google Sign-In from Login or Register page
     * Checks if user exists and routes accordingly
     */
    const handleGoogleSignIn = async (idToken) => {
        setError("");
        try {
            const response = await googleAuthenticate(idToken);

            if (response.isNewUser) {
                // New user - show username input (RegisterCredentials but only username)
                setGoogleIdToken(idToken);
                setGoogleUserEmail(response.email);
                setUsername(""); // Reset username
                setRegisterStage(1); // Go directly to username stage (skip email)
                setAuthOption(1); // Switch to register view
                setIsGoogleFlow(true);
            } else {
                // Existing user - log them in
                setToken(response.token);
                navigate("/app");
            }
        } catch (err) {
            setError(err.message || "Google authentication failed");
        }
    };

    const handleRegisterContinue = () => {
        if (registerEmail && isValidEmail(registerEmail)) {
            setRegisterStage(1);
            setError("");
        } else {
            setError("Please enter a valid email address");
        }
    };

    /**
     * For Google flow: only username is required
     * For regular flow: username and password are required
     */
    const handleCredentialsContinue = () => {
        if (isGoogleFlow) {
            // Google flow: just username, go to gender stage
            if (username && username.length >= 4) {
                setRegisterStage(2);
                setError("");
            } else {
                setError("Username must be at least 4 characters");
            }
        } else {
            // Regular flow: username and password required
            const passwordErrors = [];
            if (registerPassword.length < 12) {
                passwordErrors.push("At least 12 characters");
            }
            if (!/[a-zA-Z]/.test(registerPassword)) {
                passwordErrors.push("At least one letter");
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(registerPassword)) {
                passwordErrors.push("At least one special character");
            }

            if (username && registerPassword && passwordErrors.length === 0) {
                setRegisterStage(2);
                setError("");
            } else if (!username) {
                setError("Please enter a username");
            } else if (!registerPassword) {
                setError("Please enter a password");
            } else {
                setError("Password does not meet requirements");
            }
        }
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleFinalRegister = async () => {
        setLoading(true);
        setError("");
        try {
            if (isGoogleFlow) {
                // Google registration: use Google endpoint
                const result = await completeGoogleRegistration(googleIdToken, username, gender);
                setToken(result.token);
                navigate("/app");
            } else {
                // Regular registration
                const result = await registerUser({
                    email: registerEmail,
                    username,
                    password: registerPassword,
                    gender,
                });

                setToken(result.token);
                navigate("/app");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        if (registerStage > 0) {
            setRegisterStage(registerStage - 1);
        }
    };

    const handleLoginClick = async () => {
        setLoginLoading(true);
        try {
            await loginRef.current?.handleLogin();
        } catch (err) {
            // Error is already handled in Login component
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="authBox-container">
            {(registerStage > 0 || isGoogleFlow) && (
                <button className="authBox-back-btn" onClick={() => { 
                    setAuthOption(0); 
                    setRegisterStage(0); 
                    setIsGoogleFlow(false);
                    setGoogleIdToken("");
                    setGoogleUserEmail("");
                }}>
                    <svg className="back-icon" fill="currentColor" height="20" icon-name="arrow-back" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 9.1H4.679l5.487-5.462a.898.898 0 00.003-1.272.898.898 0 00-1.272-.003l-7.032 7a.898.898 0 000 1.275l7.03 7a.896.896 0 001.273-.003.898.898 0 00-.002-1.272l-5.487-5.462h12.82a.9.9 0 000-1.8z"></path>
                    </svg>
                </button>
            )}
            {error && <div className="error-message">{error}</div>}
            {authOption === 0 && <Login ref={loginRef} email={email} setEmail={setEmail} password={password} setPassword={setPassword} onGoogleSignIn={handleGoogleSignIn} />}
            {authOption === 1 && registerStage === 0 && <Register email={registerEmail} setEmail={setRegisterEmail} onGoogleSignIn={handleGoogleSignIn} />}
            {authOption === 1 && registerStage === 1 && (
                <RegisterCredentials 
                    username={username}
                    setUsername={setUsername}
                    password={registerPassword}
                    setPassword={setRegisterPassword}
                    onBack={handleBackClick}
                    isGoogleFlow={isGoogleFlow}
                    googleEmail={googleUserEmail}
                />
            )}
            {authOption === 1 && registerStage === 2 && (
                <RegisterAboutYou 
                    onGenderSelect={handleGenderSelect}
                    onBack={handleBackClick}
                    selectedGender={gender}
                />
            )}
            {authOption === 0 && <div className="switch-btn"><p>New to Loopify? &nbsp;</p> <a onClick={() => setAuthOption(1)}>Sign up</a></div>}
            {authOption === 1 && registerStage === 0 && <div className="switch-btn"><p>Already a Loopifier? &nbsp;</p> <a onClick={() => { setAuthOption(0); setRegisterStage(0); }}>Log In</a></div>}
            {authOption === 0 && <button className="authBox-auth-btn" onClick={handleLoginClick} disabled={loginLoading}>
                {loginLoading ? <Spinner /> : "Log in"}
            </button>}
            {authOption === 1 && registerStage === 0 && <button data-register-continue className="authBox-auth-btn" onClick={handleRegisterContinue} disabled={!registerEmail || !isValidEmail(registerEmail)}>Continue</button>}
            {authOption === 1 && registerStage === 1 && <button data-credentials-continue className="authBox-auth-btn" onClick={handleCredentialsContinue} disabled={isGoogleFlow ? !username || username.length < 4 : !username || !registerPassword}>Continue</button>}
            {authOption === 1 && registerStage === 2 && <button data-gender-continue className="authBox-auth-btn" onClick={handleFinalRegister} disabled={loading}>
                {loading ? <Spinner /> : "Continue"}
            </button>}
        </div>
    );
}

export default AuthBox;
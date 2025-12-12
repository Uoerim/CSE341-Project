import React from "react";
import "./authBox.css";
import Login from "./Login/Login";
import Register from "./Register/Register";
import RegisterCredentials from "./Register/RegisterCredentials";
import RegisterAboutYou from "./Register/RegisterAboutYou";
import Spinner from "../Global/Spinner/Spinner";
import {
  registerUser,
  setToken,
  googleAuthenticate,
  completeGoogleRegistration,
  phoneAuthenticate,
  updateUserProfile,
} from "../../services";
import { useNavigate } from "react-router-dom";
import PhoneLogin from "./Login/PhoneLogin/PhoneLogin";
import PhoneVerification from "./Login/PhoneLogin/PhoneVerification";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";

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
  const [gender, setGender] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);

  // Google auth flow state
  const [googleIdToken, setGoogleIdToken] = React.useState("");
  const [isGoogleFlow, setIsGoogleFlow] = React.useState(false);
  const [googleUserEmail, setGoogleUserEmail] = React.useState("");

  const [phoneCode, setPhoneCode] = React.useState({
    countryName: "Egypt",
    flagEmoji: "🇪🇬",
    code: "+20",
    countryCode: "EG",
  });
  const [isPhoneFlow, setIsPhoneFlow] = React.useState(false);

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
        const result = await completeGoogleRegistration(
          googleIdToken,
          username,
          gender
        );
        setToken(result.token);
        navigate("/app"); // Google path
      } else if (isPhoneFlow) {
        await updateUserProfile({ gender }); // PUT /api/user/me
        navigate("/app"); // Phone path: same redirect
      } else {
        const result = await registerUser({
          email: registerEmail,
          username,
          password: registerPassword,
          gender,
        });
        setToken(result.token);
        navigate("/app"); // Email path
      }
    } catch (err) {
      setError(err.message || "Failed to save profile");
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
  // Add these states to the existing AuthBox.jsx component
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [showPhoneLogin, setShowPhoneLogin] = React.useState(false);
  const [showPhoneVerification, setShowPhoneVerification] =
    React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");

  // Add a function to handle phone login initiation
  const handlePhoneLoginClick = () => {
    setShowPhoneLogin(true);
    setAuthOption(0); // Keep it on login view
    setPhoneNumber("");
    setError("");
  };

  // Add a function to handle phone number submission
  const handlePhoneSubmit = async (phone) => {
    setError("");
    if (!phone) return;

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      setShowPhoneLogin(false);
      setShowPhoneVerification(true);
      setPhoneNumber(phone);
      setError("");
      console.log("OTP sent to:", phone);
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError("Failed to send OTP. Make sure the phone number is correct.");
    }
  };

  // Add a function to handle verification completion
  const handlePhoneVerificationComplete = async (phone, code, firebaseUser) => {
    setLoading(true);
    setError("");

    try {
      const idToken = await firebaseUser.getIdToken();
      const result = await phoneAuthenticate(idToken);
      // { token, isNewUser, needsProfile, ... }

      setToken(result.token);
      setIsPhoneFlow(true);

      setShowPhoneVerification(false);
      setPhoneNumber("");
      setVerificationCode("");
      setError("");

      if (result.needsProfile) {
        setAuthOption(1);
        setRegisterStage(2); // About you
      } else {
        navigate("/app");
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Add a function to go back from phone views
  const handleBackFromPhone = () => {
    setShowPhoneLogin(false);
    setShowPhoneVerification(false);
    setPhoneNumber("");
    setVerificationCode("");
    setError("");
  };
  return (
    <div className="authBox-container">
      {/* Top bar container */}

      <div className="authBox-topbar">
        <div className="authBox-back-btn-wrapper">
          {/* BACK ARROW — only visible on certain screens */}
          {(registerStage > 0 ||
            isGoogleFlow ||
            showPhoneLogin ||
            showPhoneVerification) && (
            <button
              className="authBox-back-btn"
              onClick={() => {
                if (showPhoneLogin) {
                  setShowPhoneLogin(false);
                  setPhoneNumber("");
                } else if (showPhoneVerification) {
                  setShowPhoneVerification(false);
                  setShowPhoneLogin(true);
                } else {
                  setAuthOption(0);
                  setRegisterStage(0);
                  setIsGoogleFlow(false);
                  setGoogleIdToken("");
                  setGoogleUserEmail("");
                }
              }}
            >
              <svg
                className="back-icon"
                fill="currentColor"
                height="20"
                viewBox="0 0 20 20"
                width="20"
              >
                <path d="M17.5 9.1H4.679l5.487-5.462a.898.898 0 00.003-1.272.898.898 0 00-1.272-.003l-7.032 7a.898.898 0 000 1.275l7.03 7a.896.896 0 001.273-.003.898.898 0 00-.002-1.272l-5.487-5.462h12.82a.9.9 0 000-1.8z" />
              </svg>
            </button>
          )}
        </div>

        {/* CLOSE BUTTON — always visible */}
        <button className="authBox-close-btn" onClick={() => navigate("/")}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* CONTENT */}
      <div className="authBox-content-area">
        <div className="authBox-main-content">
          {/* Phone Authentication Views */}
          {showPhoneLogin && (
            <div className="authBox-page-wrapper">
              <PhoneLogin
                phoneNumber={phoneNumber}
                onBackToLogin={handleBackFromPhone}
                setPhoneNumber={setPhoneNumber}
                onPhoneSubmit={handlePhoneSubmit}
                phoneCode={phoneCode}
                setPhoneCode={setPhoneCode}
              />
            </div>
          )}

          {showPhoneVerification && (
            <div className="authBox-page-wrapper">
              <PhoneVerification
                phoneNumber={phoneNumber}
                onVerificationComplete={handlePhoneVerificationComplete}
                onBack={handleBackFromPhone}
              />
            </div>
          )}

          {/* Regular Login/Register Views - Only show when not in phone flow */}
          {!showPhoneLogin && !showPhoneVerification && (
            <>
              {authOption === 0 && (
                <Login
                  ref={loginRef}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  onGoogleSignIn={handleGoogleSignIn}
                  onPhoneLoginClick={handlePhoneLoginClick} // Pass the handler
                />
              )}

              {authOption === 1 && registerStage === 0 && (
                <Register
                  email={registerEmail}
                  setEmail={setRegisterEmail}
                  onGoogleSignIn={handleGoogleSignIn}
                  onPhoneLoginClick={handlePhoneLoginClick}
                />
              )}

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

              {/* Switch buttons - only show when not in phone flow */}
              {!showPhoneLogin &&
                !showPhoneVerification &&
                authOption === 0 && (
                  <div className="switch-btn">
                    <p>New to Loopify? &nbsp;</p>
                    <a onClick={() => setAuthOption(1)}>Sign up</a>
                  </div>
                )}

              {!showPhoneLogin &&
                !showPhoneVerification &&
                authOption === 1 &&
                registerStage === 0 && (
                  <div className="switch-btn">
                    <p>Already a Loopifier? &nbsp;</p>
                    <a
                      onClick={() => {
                        setAuthOption(0);
                        setRegisterStage(0);
                      }}
                    >
                      Log In
                    </a>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      <div className="authBox-bottom">
        {!showPhoneLogin && !showPhoneVerification && authOption === 0 && (
          <button
            className="authBox-auth-btn"
            onClick={handleLoginClick}
            disabled={loginLoading}
          >
            {loginLoading ? <Spinner /> : "Log in"}
          </button>
        )}

        {showPhoneLogin && (
          <button
            className="authBox-auth-btn"
            onClick={() => {
              const trimmed = phoneNumber.trim();
              if (!trimmed) return;

              let digits = trimmed.replace(/\D/g, "");
              if (digits.startsWith("0")) {
                digits = digits.slice(1);
              }

              const e164 = `${phoneCode.code}${digits}`; // "+20" + "1023..." => "+201023..."
              handlePhoneSubmit(e164);
            }}
            disabled={!phoneNumber}
          >
            Continue
          </button>
        )}

        {showPhoneVerification && (
          <button
            className="authBox-auth-btn"
            onClick={() =>
              handlePhoneVerificationComplete(phoneNumber, verificationCode)
            }
            disabled={!verificationCode}
          >
            Continue
          </button>
        )}

        {!showPhoneLogin &&
          !showPhoneVerification &&
          authOption === 1 &&
          registerStage === 0 && (
            <button
              className="authBox-auth-btn"
              onClick={handleRegisterContinue}
              disabled={!registerEmail || !isValidEmail(registerEmail)}
            >
              Continue
            </button>
          )}

        {!showPhoneLogin &&
          !showPhoneVerification &&
          authOption === 1 &&
          registerStage === 1 && (
            <button
              className="authBox-auth-btn"
              onClick={handleCredentialsContinue}
              disabled={
                isGoogleFlow
                  ? !username || username.length < 4
                  : !username || !registerPassword
              }
            >
              Continue
            </button>
          )}

        {!showPhoneLogin &&
          !showPhoneVerification &&
          authOption === 1 &&
          registerStage === 2 && (
            <button
              className="authBox-auth-btn"
              onClick={handleFinalRegister}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Continue"}
            </button>
          )}
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default AuthBox;

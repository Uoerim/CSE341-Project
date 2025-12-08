import React from "react";
import './login.css';
import Textbox from "../../Global/textbox/textbox";
import GoogleSignInButton from "../GoogleSignInButton";
import PhoneLogin from "./PhoneLogin/PhoneLogin";
import phoneIcon from "../../../assets/vecteezy_smartphone-vector-icon-phone-black-symbol-isolated-on-white_4897371.svg";
import { loginUser, setToken } from "../../../services";
import { useNavigate } from "react-router-dom";

function Login({ email, setEmail, password, setPassword, onHandleLogin, onGoogleSignIn }, ref) {
    const navigate = useNavigate();
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [googleLoading, setGoogleLoading] = React.useState(false);
    const [showPhoneLogin, setShowPhoneLogin] = React.useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Invalid username or password.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const result = await loginUser(email, password);
            setToken(result.token);
            navigate("/app");
        } catch (err) {
            setError("Invalid username or password.");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async (token) => {
        setGoogleLoading(true);
        setError("");
        try {
            if (onGoogleSignIn) {
                await onGoogleSignIn(token);
            }
        } catch (err) {
            setError(err.message || "Google Sign-In failed");
            setGoogleLoading(false);
        }
    };

    const handlePhoneLoginClick = () => {
        setShowPhoneLogin(true);
        setError("");
    };

    const handleBackToLogin = () => {
        setShowPhoneLogin(false);
        setError("");
    };

    const handlePhoneVerificationComplete = (phoneNumber) => {
        // Handle successful phone verification
        console.log("Phone verified:", phoneNumber);
        // TODO: Complete phone login logic
        navigate("/app");
    };

    React.useImperativeHandle(ref, () => ({
        handleLogin,
        isLoading: loading
    }), [email, password, loading]);

    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (!showPhoneLogin && e.key === 'Enter' && email && password && !loading) {
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [email, password, loading, showPhoneLogin]);

    // Render Phone Login if active
    if (showPhoneLogin) {
        return (
            <div className="login-container">
                <PhoneLogin 
                    onBackToLogin={handleBackToLogin}
                    onPhoneVerificationComplete={handlePhoneVerificationComplete}
                    initialLoading={loading}
                />
            </div>
        );
    }

    // Render Regular Login
    return (
        <div className="login-container">
            <h1>Log In</h1>
            <p>By continuing, you agree to our <span>User Agreement</span> and acknowledge that you understand the <span>Privacy Policy</span>.</p>
            
            <div className="login-external-container">
                
                {/* Phone Login Button - Matching Google button style */}
                <button
                    className="phone-login-button"
                    onClick={handlePhoneLoginClick}
                    disabled={googleLoading || loading}
                >
                    <img src={phoneIcon} alt="" className="phone-button-icon" />
                    <span className="phone-button-text">Continue With Phone Number</span>
                </button>

                {/* Google Sign In Button */}
                <div className="google-signin-wrapper">
                    <GoogleSignInButton 
                        onSuccess={handleGoogleSignIn} 
                        onError={(err) => setError(err)} 
                        disabled={googleLoading}
                    />
                </div>
                
                <div className="login-button-placeholder">Placeholder</div>
                <div className="login-button-placeholder">Placeholder</div>
            </div>
            
            <div className="login-or-container"><hr /><div>OR</div></div>
            
            <div className="login-email-container">
                <Textbox 
                    placeholder="Email or username" 
                    type="text" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    error={error ? true : false}
                    showCheckmark={false}
                />
                <Textbox 
                    placeholder="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    error={error ? true : false}
                    showCheckmark={false}
                />
                {error && <p className="login-error-message">{error}</p>}
                <a href="#" className="forgot-password">Forgot password?</a>
            </div>
        </div>
    );
}

export default React.forwardRef(Login);
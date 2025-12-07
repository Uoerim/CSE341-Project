import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./googleSignInButton.css";

function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
    const CLIENT_ID = "23324959742-6ffe6n1k4db0lsapekqdvh8u61jt0qfi.apps.googleusercontent.com";

    const handleSuccess = (credentialResponse) => {
        if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
        }
    };

    const handleError = () => {
        onError && onError("Google Sign-In failed");
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="google-signin-wrapper">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    disabled={disabled}
                    theme="dark"
                    size="large"
                    width="100%"
                    text="signin_with"
                />
            </div>
        </GoogleOAuthProvider>
    );
}

export default GoogleSignInButton;

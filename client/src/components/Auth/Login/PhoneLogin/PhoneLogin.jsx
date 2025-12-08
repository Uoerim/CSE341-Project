import React, { useState, useEffect } from "react";
import Textbox from "../../../Global/textbox/textbox";
import "./PhoneLogin.css";

function PhoneLogin({ 
    onBackToLogin,
    onPhoneVerificationComplete,
    initialLoading = false
}) {
    const [phoneStep, setPhoneStep] = useState(1); // 1: Enter phone, 2: Enter code
    const [phoneNumber, setPhoneNumber] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(initialLoading);
    const [countdown, setCountdown] = useState(0);

    // Format phone number as user types
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        
        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setError("");
    };

    const handleContinue = async () => {
        setError("");
        
        if (phoneStep === 1) {
            // Validate phone number
            const digitsOnly = phoneNumber.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                setError("Please enter a valid 10-digit phone number");
                return;
            }

            setLoading(true);
            try {
                // TODO: Call your backend to send SMS code
                // await sendVerificationCode(phoneNumber);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setPhoneStep(2);
                // Start 60-second countdown for resend
                setCountdown(60);
            } catch (err) {
                setError("Failed to send verification code. Please try again.");
                setLoading(false);
            }
        } else {
            // Step 2: Verify code
            if (!confirmationCode || confirmationCode.length !== 6) {
                setError("Please enter the 6-digit code");
                return;
            }

            setLoading(true);
            try {
                // TODO: Call your backend to verify code
                // await verifyPhoneCode(phoneNumber, confirmationCode);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // On successful verification
                if (onPhoneVerificationComplete) {
                    onPhoneVerificationComplete(phoneNumber);
                }
            } catch (err) {
                setError("Invalid verification code. Please try again.");
                setLoading(false);
            }
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        try {
            // TODO: Call your backend to resend code
            // await resendVerificationCode(phoneNumber);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Reset countdown
            setCountdown(60);
        } catch (err) {
            setError("Failed to resend code. Please try again.");
            setLoading(false);
        }
    };

    // Handle countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle Enter key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !loading) {
                if (phoneStep === 1 && phoneNumber.replace(/\D/g, '').length === 10) {
                    handleContinue();
                } else if (phoneStep === 2 && confirmationCode.length === 6) {
                    handleContinue();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [phoneStep, phoneNumber, confirmationCode, loading]);

    return (
        <div className="phone-login-container">
            <button 
                className="phone-login-back-button"
                onClick={onBackToLogin}
                disabled={loading}
            >
                ← Back to login
            </button>
            
            <h1>{phoneStep === 1 ? "Enter your phone number" : "Enter confirmation code"}</h1>
            
            {phoneStep === 1 ? (
                <>
                    <p className="phone-login-subtitle">
                        We'll send you a text with a verification code.
                    </p>
                    
                    <div className="login-email-container">
                        <div className="phone-input-wrapper">
                            <Textbox
                                placeholder="(123) 456-7890"
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                error={error ? true : false}
                                showCheckmark={false}
                                autoFocus
                            />
                        </div>
                        
                        {error && <p className="phone-error-message">{error}</p>}
                        
                        <button
                            className="phone-continue-button"
                            onClick={handleContinue}
                            disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
                        >
                            {loading ? (
                                <>
                                    <span className="phone-loading-spinner"></span>
                                    Sending...
                                </>
                            ) : "Continue"}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="phone-login-subtitle">
                        Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
                    </p>
                    
                    <div className="login-email-container">
                        <div className="code-input-wrapper">
                            <Textbox
                                placeholder="123456"
                                type="text"
                                value={confirmationCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setConfirmationCode(value);
                                    setError("");
                                }}
                                error={error ? true : false}
                                showCheckmark={false}
                                autoFocus
                            />
                        </div>
                        
                        <div className="phone-resend-container">
                            <p>Didn't receive a code?</p>
                            <button
                                className={`phone-resend-button ${countdown > 0 ? 'phone-resend-disabled' : ''}`}
                                onClick={handleResendCode}
                                disabled={countdown > 0 || loading}
                            >
                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                            </button>
                        </div>
                        
                        {error && <p className="phone-error-message">{error}</p>}
                        
                        <button
                            className="phone-continue-button"
                            onClick={handleContinue}
                            disabled={loading || confirmationCode.length !== 6}
                        >
                            {loading ? (
                                <>
                                    <span className="phone-loading-spinner"></span>
                                    Verifying...
                                </>
                            ) : "Verify and Continue"}
                        </button>
                    </div>
                </>
            )}
            
            <div className="phone-terms-notice">
                <p>By continuing, you agree to our <span>User Agreement</span> and acknowledge that you understand the <span>Privacy Policy</span>.</p>
            </div>
        </div>
    );
}

export default PhoneLogin;
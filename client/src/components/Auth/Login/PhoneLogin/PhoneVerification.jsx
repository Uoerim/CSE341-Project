import React, { useState, useEffect } from "react";
import "./phoneVerification.css";

function PhoneVerification({ phoneNumber, onVerificationComplete, onBack }) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleCodeChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }

        // Check if all digits are filled
        if (newCode.every(digit => digit !== "")) {
            handleSubmit(newCode.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = (verificationCode) => {
        // TODO: Implement verification logic
        console.log("Verifying code:", verificationCode, "for phone:", phoneNumber);
        onVerificationComplete(phoneNumber, verificationCode);
    };

    const handleResendCode = () => {
        if (canResend) {
            // TODO: Implement resend logic
            setTimer(30);
            setCanResend(false);
            setCode(["", "", "", "", "", ""]);
            
            // Focus first input
            const firstInput = document.getElementById('code-input-0');
            if (firstInput) firstInput.focus();
        }
    };

    const formatPhoneNumber = (phone) => {
        return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
    };

    return (
        <div className="verification-container">

            <h1>Verify your phone number</h1>
            
            <p className="verification-description">
                Enter the 6-digit code we sent to <span className="phone-number">{formatPhoneNumber(phoneNumber)}</span>.
            </p>

            <div className="divider"></div>

            <div className="verification-code-container">
                <h2>Verification code</h2>
                <div className="code-inputs">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-input-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="code-input"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <div className="resend-section">
                    <p>Didn't get a code?</p>
                    <button 
                        onClick={handleResendCode} 
                        disabled={!canResend}
                        className="resend-btn"
                    >
                        {canResend ? "Resend code" : `Resend in 0:${timer.toString().padStart(2, '0')}`}
                    </button>
                </div>
            </div>

            <button 
                className="continue-btn"
                onClick={() => handleSubmit(code.join(""))}
                disabled={code.some(digit => digit === "")}
            >
                Continue
            </button>
        </div>
    );
}

export default PhoneVerification;
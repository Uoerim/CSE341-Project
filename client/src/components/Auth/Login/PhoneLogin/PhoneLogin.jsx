import React, { useState } from "react";
import "./PhoneLogin.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PhoneLogin({ onPhoneSubmit }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!phoneNumber) return;
        
        setIsSubmitting(true);
        try {
            // phoneNumber already includes country code
            await onPhoneSubmit(phoneNumber);
        } catch (error) {
            console.error("Phone submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="phone-login-container">
            <h1>Sign up or log in with your phone number</h1>
            
            <div className="phone-input-wrapper">
                <PhoneInput
                    country={'eg'}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    inputClass="phone-input"
                    containerClass="phone-container"
                    buttonClass="phone-dropdown-button"
                    dropdownClass="phone-dropdown"
                    inputProps={{
                        autoFocus: true,
                        placeholder: "Phone number"
                    }}
                    countryCodeEditable={false}
                />
            </div>

            <p className="phone-disclaimer">
                Loopify will use your phone number for account verification and to personalize your ads and experience. 
                SMS fees may apply. <a href="#" className="learn-more-link">Learn more.</a>
            </p>

            <button 
                className="continue-btn" 
                onClick={handleSubmit}
                disabled={!phoneNumber || isSubmitting}
            >
                {isSubmitting ? "Sending..." : "Continue"}
            </button>
        </div>
    );
}
export default PhoneLogin;
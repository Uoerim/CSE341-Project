import React, { useState } from "react";
import "./PhoneLogin.css";
import CountryCodeSelector from "./Countries/CountryCodeSelector.jsx";

function PhoneLogin({ phoneNumber, setPhoneNumber, onPhoneSubmit }) {
  const [phoneCode, setPhoneCode] = useState({
    countryName: "Egypt",
    flagEmoji: "🇪🇬",
    code: "+20",
    countryCode: "EG",
  });

  const handleSubmit = () => {
    if (phoneNumber.trim()) {
      onPhoneSubmit(phoneCode.code + phoneNumber);
    }
  };

  return (
    <div className="phone-login-screen">
      <h1 className="phone-title">Sign up or log in with your phone number</h1>

      <div className="phone-row">
        <CountryCodeSelector
          selectedCode={phoneCode}
          setSelectedCode={setPhoneCode}
        />

        <div className="phone-input-wrapper">
          <input
            type="text"
            className="phone-number-input"
            placeholder=" "
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <label className="phone-number-label">Phone number</label>
        </div>
      </div>

      <p className="phone-disclaimer">
        Loopify will use your phone number for account verification and to
        personalize your experience. SMS fees may apply.{" "}
        <a href="#">Learn more.</a>
      </p>
    </div>
  );
}
export default PhoneLogin;
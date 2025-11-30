import React from "react";
import './register.css';
import Textbox from "../../Global/textbox/textbox";

function Register({ email, setEmail, password, setPassword }) {
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
                <Textbox placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
        </div>
    );
}

export default Register;
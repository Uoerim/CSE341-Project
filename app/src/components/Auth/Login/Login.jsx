import React from "react";
import './login.css';
import Textbox from "../../Global/textbox/textbox";

function Login({ email, setEmail, password, setPassword }) {
    return (
        <div className="login-container">
            <h1>Log In</h1>
            <p>By continuing, you agree to our <span>User Agreement</span> and acknowledge that you understand the <span>Privacy Policy</span>.</p>
            <div className="login-external-container">
                <div className="login-button-placeholder">Placeholder</div>
                <div className="login-button-placeholder">Placeholder</div>
                <div className="login-button-placeholder">Placeholder</div>
                <div className="login-button-placeholder">Placeholder</div>

            </div>
            <div className="login-or-container"><hr /><div>OR</div></div>
            <div className="login-email-container">
                <Textbox placeholder="Email or username" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Textbox placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <a href="#" className="forgot-password">Forgot password?</a>
            </div>
        </div>
    );
}

export default Login;
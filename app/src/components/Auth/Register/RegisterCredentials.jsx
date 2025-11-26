import React from "react";
import './registerCredentials.css';
import Textbox from "../../Global/textbox/textbox";

function RegisterCredentials() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <div className="register-credentials-container">
            <div className="register-credentials-header">
                <button className="register-back-btn">←</button>
            </div>
            <h1>Create your username and password</h1>
            <p>Reddit is anonymous, so your username is what you'll go by here. Choose wisely—because once you get a name, you can't change it.</p>
            <div className="register-credentials-inputs">
                <Textbox placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Textbox placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
    );
}

export default RegisterCredentials;

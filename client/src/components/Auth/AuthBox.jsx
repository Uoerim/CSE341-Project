import React from "react";
import "./authBox.css";
import Login from "./Login/Login";
import Register from "./Register/Register";
import RegisterCredentials from "./Register/RegisterCredentials";
import RegisterAboutYou from "./Register/RegisterAboutYou";

function AuthBox() {
    const [authOption, setAuthOption] = React.useState(0);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [registerEmail, setRegisterEmail] = React.useState("");
    const [registerStage, setRegisterStage] = React.useState(0);
    const [gender, setGender] = React.useState(null);
    const isLoginDisabled = !email || !password;

    const handleRegisterContinue = () => {
        if (registerEmail) {
            setRegisterStage(1);
        }
    };

    const handleCredentialsContinue = () => {
        setRegisterStage(2);
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };

    return (
        <div className="authBox-container">
            {authOption === 0 && <Login email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
            {authOption === 1 && registerStage === 0 && <Register email={registerEmail} setEmail={setRegisterEmail} />}
            {authOption === 1 && registerStage === 1 && <RegisterCredentials />}
            {authOption === 1 && registerStage === 2 && <RegisterAboutYou onGenderSelect={handleGenderSelect} />}
            {authOption === 0 && <div className="switch-btn"><p>New to Loopify? &nbsp;</p> <a onClick={() => setAuthOption(1)}>Sign up</a></div>}
            {authOption === 1 && registerStage === 0 && <div className="switch-btn"><p>Already a Loopifier? &nbsp;</p> <a onClick={() => { setAuthOption(0); setRegisterStage(0); }}>Log In</a></div>}
            {authOption === 0 && <button className="authBox-auth-btn" onClick={() => setAuthOption(-1)} disabled={isLoginDisabled}>Log in</button>}
            {authOption === 1 && registerStage === 0 && <button className="authBox-auth-btn" onClick={handleRegisterContinue} disabled={!registerEmail}>Continue</button>}
            {authOption === 1 && registerStage === 1 && <button className="authBox-auth-btn" onClick={handleCredentialsContinue}>Continue</button>}
            {authOption === 1 && registerStage === 2 && <button className="authBox-auth-btn" onClick={() => setAuthOption(-1)}>Continue</button>}
        </div>
    );
}

export default AuthBox;
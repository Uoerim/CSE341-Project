import React from "react";
import './login.css';
import Textbox from "../../Global/textbox/textbox";
import Spinner from "../../Global/Spinner/Spinner";
import { loginUser, setToken } from "../../../services";
import { useNavigate } from "react-router-dom";

function Login({ email, setEmail, password, setPassword, onHandleLogin }, ref) {
    const navigate = useNavigate();
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

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

    React.useImperativeHandle(ref, () => ({
        handleLogin,
        isLoading: loading
    }), [email, password, loading]);

    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && email && password && !loading) {
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [email, password, loading]);

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
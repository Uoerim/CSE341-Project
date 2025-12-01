import React, { useEffect } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { getToken, verifyToken } from "../../services";
import AuthNav from "../../components/Auth/AuthNav/AuthNav";
import AuthBox from "../../components/Auth/AuthBox";

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      if (token) {
        try {
          const isValid = await verifyToken(token);
          if (isValid) {
            navigate("/app", { replace: true });
          }
        } catch (error) {
          // Token is invalid, stay on login
        }
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="auth-wrapper">
      <div
        className="auth-bg"
      />
      <img src="/auth-bg.svg" alt="background" className="auth-background" />

      <AuthNav />
      <AuthBox />

    </div>
  );
}

export default Auth;

import React from "react";
import "./auth.css";
import AuthNav from "../../components/Auth/AuthNav/AuthNav";
import AuthBox from "../../components/Auth/AuthBox";

function Auth() {
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
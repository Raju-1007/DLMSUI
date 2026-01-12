import React from "react";

import { useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();

  return (
    <div className="main-header">
      <div className="header-left">
        🎓 EduVerse University Portal
      </div>

      <div className="header-right">
        <span onClick={() => nav("/dashboard")}>Dashboard</span>
        <span onClick={() => nav("/login")}>Login</span>
        <span onClick={() => nav("/register")}>Register</span>
      </div>
    </div>
  );
}

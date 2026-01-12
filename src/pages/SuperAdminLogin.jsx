import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginMock } from "../lib/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { useMessage } from "../context/MessageContext"; 



export default function SuperAdminLogin() {
  const { showSuccess, showError } = useMessage();
  const nav = useNavigate();

  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    loadRoles();
    loadCaptcha();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/getRoles");
       const filtered = res.data.filter(
        (r) => r !== "ADMIN"  &&  r !== "TEACHER" && r !== "STUDENT"
      );

      setRoles(filtered);
    } catch(err) {
      showError("Error loading roles");
    }
  };

  const loadCaptcha = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/generate");
      setCaptchaValue(res.data.captchaValue);
      setCaptchaId(res.data.captchaId);
      setCaptchaInput("");
    } catch(err) {
      showError("Failed to load captcha");
    }
  };

  const doLogin = async () => {
    if (!role || !password || !captchaInput) {
      showSuccess("All fields are required");
      return;
    }

    try {
      const result = await axios.post(
        import.meta.env.VITE_API_BASE_URL+"/api/roles/getloginData",
        {
          role:role,
          password:password,
          captchaId:captchaId,
          captchaInput:captchaInput,
        }
      );

      if (result.data.status === "error") {
        showError(result.data.message);
        loadCaptcha();
        return;
      }
     localStorage.setItem("loginDetails", JSON.stringify(result.data));
      // localStorage.setItem("token", result.data.token);
      localStorage.setItem("role", result.data.role);
      showSuccess("Login Successful ✅");
      loginMock(role);
     

     if(result.data.role == 'SUPER_ADMIN' ){ 
              nav("/SuperAdminDashboard")
      }
    
    } catch(err) {
      showError("Login failed. Something went wrong.");
    }
  };

const navigateSuperAdmin=()=>{
  nav("/SuperAdminLogin");
}

  return (
  <div>
    {/* <Header /> */}

    <div className="page-container">

      <div className="login-card">
        <h2 className="title">Login to your Account</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          {roles.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>
         
     <div className="password-wrapper">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
  <div  className="input">
  <input  type="text" placeholder="Enter Captcha"  value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
  />
  </div>

        <div>
  {/* CAPTCHA NUMBERS + REFRESH BUTTON IN SAME ROW */}
  <div className="captcha-top-row">
    <div className="captcha-box">
      {captchaValue.split("").map((char, index) => (
        <span key={index} className="captcha-char">
          {char}
        </span>
      ))}
    </div>

    <button
      type="button"
      onClick={loadCaptcha}
      className="captcha-refresh-btn"
    >
      ↻
    </button>
  </div>

</div>

        <button className="login-btn" onClick={doLogin}>Login</button>

      </div>

    </div>

    {/* <Footer /> */}
  </div>
)
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserThunk } from "../redux/authSlice";
import { loginMock } from "../lib/auth";
import { useMessage } from "../context/MessageContext";
import { getDepartmentUpdatePropfileDetails, getStudentUpdatePropfileDetails, LoginActivity } from "../components/LoginActivity";

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { showError, showSuccess } = useMessage();

  /* ================= MODE ================= */
  const [loginType, setLoginType] = useState("student"); // student | department

  /* ================= COMMON ================= */
  const [password, setPassword] = useState("");

  /* ================= STUDENT ================= */
  const [studentId, setStudentId] = useState("");

  /* ================= DEPARTMENT ================= */
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  // const [adhaarValue, setAdhaarValue] = useState("");
  const [departmentId, setDepartmentId] = useState("");


  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  /* ================= FORGOT ================= */
  const [showForgot, setShowForgot] = useState(false);
  const [fpAadhar, setFpAadhar] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false)
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [passwordToggleClass, setPasswordToggleClass] = useState("")
  const [email, setEmail] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    loadCaptcha();
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/login/getRoles"
    );
    setRoles(res.data.filter(r => r !== "STUDENT"));


  };

  const loadCaptcha = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/login/generate"
    );
    setCaptchaValue(res.data.captchaValue);
    setCaptchaId(res.data.captchaId);
  };

  useEffect(() => {
    if (passwordShown == true) {
      setPasswordToggleClass("visible")
    }
    if (passwordShown == false) {
      setPasswordToggleClass("notVisible")
    }
  }, [passwordShown])
  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  /* ================= LOGIN ================= */
  const doLogin = async () => {
    if (!password) return showError("Please enter password");

    let payload ={};

    // ✅ STUDENT LOGIN
    if (loginType === "student") {
      if (!studentId) return showError("Please enter valid student ID");


payload = {
  role: "STUDENT",
  password,
  loginid: studentId,
  captchaId,
  captchaInput,
};


    }

    // ✅ DEPARTMENT LOGIN
    if (loginType === "department") {
      if (!role) return showError("Select role");
      if (!departmentId) return showError("Login ID not generated");
      if (!/^\d{4}$/.test(captchaInput))
        return showError("Captcha must be 4 digits");

    
payload = {
  role,
  loginid: departmentId,
  password,
  captchaId,
  captchaInput,
};


    }

    try {
      // 🔥 API CALL
      const res = await dispatch(loginUserThunk(payload)).unwrap();

      
showSuccess(res?.message || "Login Success");

// 🔥 STUDENT FLOW
if (loginType === "student") {
  loginMock("STUDENT");

  const data = await getStudentUpdatePropfileDetails(
    res,
    showSuccess,
    showError
  );

  if (!data || data === "null" || data === "undefined") {
    nav("/updateProfile");
  } else {
    nav("/dashboard");
  }
}

// 🔥 DEPARTMENT FLOW
if (loginType === "department") {
  loginMock(role);

  LoginActivity(res, showSuccess, showError);

  const tedata = await getDepartmentUpdatePropfileDetails(
    res,
    showSuccess,
    showError
  );

  const userRole = res?.userDetails?.role;

  const routes = {
    ADMIN: "/admin/dashboard",
    SUPER_ADMIN: "/SuperAdminDashboard",
    TEACHER: "/teacher/dashboard",
  };

  const navigateTo = tedata
    ? routes[userRole] || routes.TEACHER
    : "/teacherupdateProfile";

  nav(navigateTo);
}


    } catch (err) {
      // 🔥 REAL ERROR HANDLING
       showError(err);
      
    }
  };


  const getLoginIdLabel = () => {
    if (!role) return "";
    if (role === "ADMIN") {
      return {
        label: "Admin ID *",
        placeholder: "Enter Admin ID",
      };
    }
    if (role === "TEACHER") {
      return {
        label: "Teacher ID *",
        placeholder: "Enter Teacher ID",
      };
    }
    if (role === "SUPER_ADMIN") {
      return {
        label: "Super Admin ID *",
        placeholder: "Enter Super Admin ID",
      };
    }
  };


  /* ================= FORGOT ================= */
  const handleForgotSubmit = async () => {
    if (!/^\d{12}$/.test(fpAadhar))
      return showError("Aadhaar must be 12 digits");
    if (fpPassword !== fpConfirmPassword)
      return showError("Passwords do not match");
    if (!/^\d{4}$/.test(captchaInput))
      return showError("Captcha must be 4 digits");

    await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/login/forgot-password",
      {
        aadhar: fpAadhar,
        newPassword: fpPassword,
        confirmPassword: fpConfirmPassword,
        email: email,
        captchaId,
        captchaInput
      }
    );

    showSuccess("Password updated");
    setShowForgot(false);
  };

  /* ================= UI ================= */
  return (
    <div className="page-container">
      <div className="login-card">
        <h2 className="title">LOGIN</h2>
        <div className="login-type">
          <label className="radio-option">
            <input
              type="radio"
              checked={loginType === "student"}
              onChange={() => setLoginType("student")}
            />{" "}
            Student Login
          </label>

          <label className="radio-option">
            <input
              type="radio"
              checked={loginType === "department"}
              onChange={() => setLoginType("department")}
            />{" "}
            Department Login
          </label>
        </div>

        {/* ========== STUDENT ========== */}
        {loginType === "student" && (
          <>
            <label>Student ID *</label>
            <input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <label>Password *</label>
            <div className="departmentPassword">
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className={`passwordToggle ${passwordShown ? "visible" : "notVisible"}`} onClick={togglePassword}>
                <span>{passwordShown ? "Hide" : "Show"}</span>
              </div>
            </div>
            <p className="forgot-link" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </p>
            <div>
              <label>Captcha *</label>
              <div className="captinput">
                <input
                  placeholder="Enter Captcha"
                  className="captchainput"
                  maxLength={4}
                  value={captchaInput}
                  onChange={(e) =>
                    setCaptchaInput(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
              <div className="captachInputrow">
                <div className="captcha-row">
                  <div className="captcha-box">
                    {captchaValue.split("").map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </div>
                  <button onClick={loadCaptcha} className="captcha-refresh-btn">
                    ↻
                  </button>
                </div>
              </div>
            </div>
            <button className="login-btn" onClick={doLogin}>
              Login
            </button>
            <p style={{ textAlign: "center" }}>
              You dont have an account? <a href="/register">register</a>
            </p>

          </>

        )}

        {/* ========== DEPARTMENT ========== */}
        {loginType === "department" && (
          <>
            <label>Select Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              {roles.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </select>
            {role && (
              <>
                <label>{getLoginIdLabel().label}</label>
                <input
                  placeholder={getLoginIdLabel().placeholder}
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                />
              </>
            )}
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="forgot-link" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </p>

            <label>Captcha *</label>
            <div className="captinput">
              <input
                placeholder="Enter Captcha"
                className="captchainput"
                maxLength={4}
                value={captchaInput}
                onChange={(e) =>
                  setCaptchaInput(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
            <div>
              <div className="captachInputrow">
                <div className="captcha-row">
                  <div className="captcha-box">
                    {captchaValue.split("").map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </div>
                  <button onClick={loadCaptcha} className="captcha-refresh-btn">
                    ↻
                  </button>
                </div>
                <button className="loginjsx" onClick={doLogin}>
                  Login
                </button>
                <div className="registercss">
                </div>
              </div>
              <p >You dont have an account? <a href="/departmentLogin">register</a></p>
            </div>
          </>
        )}






      </div>

      {/* FORGOT PASSWORD */}
      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Forgot Password</h2>

            <label>Aadhaar *</label>
            <input
              placeholder="Enter AadhaarNumber"
              maxLength={12}
              value={fpAadhar}
              onChange={(e) =>
                setFpAadhar(e.target.value.replace(/\D/g, ""))
              }
            />

            <label>Email *</label>
            <input
              placeholder="Enter email"
              maxLength={150}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>New Password *</label>
            <input
              placeholder="Enter password"
              type="password"
              value={fpPassword}
              onChange={(e) => setFpPassword(e.target.value)}
            />

            <label>Confirm Password *</label>
            <input
              placeholder="Enter confirmPassword"
              type="password"
              value={fpConfirmPassword}
              onChange={(e) => setFpConfirmPassword(e.target.value)}
            />

            <label>Enter Captcha *</label>
            <input
              placeholder="Enter captcha"
              maxLength={4}
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(e.target.value.replace(/\D/g, ""))
              }
            />

            <div className="captcha-row">
              <div className="captcha-boxx">{captchaValue}</div>
              <button onClick={loadCaptcha}>↻</button>
            </div>

            <button className="login-btn" onClick={handleForgotSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


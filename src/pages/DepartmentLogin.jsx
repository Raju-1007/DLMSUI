import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext";

export default function DepartmentLogin() {
  const { showSuccess, showError } = useMessage();
  const nav = useNavigate();
  const [roles, setRoles] = useState([]);
  const [passwordToggleClass, setPasswordToggleClass] = useState("")
  const [passwordShown, setPasswordShown] = useState(false)
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    aadhar: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/login/getRoles"
      );
      setRoles(res.data.filter(r => r !== "SUPER_ADMIN" && r !== "STUDENT"));
    } catch {}
  };

  /* ================= PASSWORD RULES ================= */
  const passwordChecks = {
    length: form.password.length >= 11 && form.password.length <= 15,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[@#$%^&*!]/.test(form.password),
  };

  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);

  /* ================= ERRORS ================= */
  const errors = {
    fullName:
      form.fullName && form.fullName.length < 3
        ? "Full name must be at least 3 characters"
        : "",
    email:
      form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? "Invalid email format"
        : "",
    mobile:
      form.mobile && !/^[0-9]{10}$/.test(form.mobile)
        ? "Mobile must be 10 digits"
        : "",
    aadhar:
      form.aadhar && !/^[0-9]{12}$/.test(form.aadhar)
        ? "Aadhaar must be 12 digits"
        : "",
    password:
      form.password && !isPasswordStrong
        ? "Password is not strong"
        : "",
    confirmPassword:
      form.confirmPassword && form.confirmPassword !== form.password
        ? "Passwords do not match"
        : "",
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
    if (name === "aadhar" && !/^\d{0,12}$/.test(value)) return;

    setForm({ ...form, [name]: value });
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
    const toggleConfirmPassword = () => {
      setConfirmPasswordShown((prev) => !prev);
    };

  /* ================= SUBMIT ================= */
  const doRegister = async () => {
    if (Object.values(errors).some(Boolean)) {
      showError("Please fix validation errors");
      return;
    }

    try {
      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/login/addloginData",
        {
          fullName: form.fullName,
          email: form.email,
          mobile: form.mobile,
          adhaarValue: form.aadhar,
          role: form.role,
          password: form.password,
          ConfirmPassword: form.confirmPassword,
        }
      );
      showSuccess("Registered successfully");
      nav("/");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="reg-wrapper">
      <div className="left-panel" />
      <div className="right-panel">
        <div className="reg-card">
          <h2 className="reg-title">New Registration</h2>
          <div className="reg-grid">
            <div className="field">
              <label>Full Name *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error-border" : ""}
                placeholder="Enter full name"
              />
              <span className="error-space">{errors.fullName}</span>
            </div>

            <div className="field">
              <label>Email *</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error-border" : ""}
              />
              <span className="error-space">{errors.email}</span>
            </div>

            <div className="field">
              <label>Mobile Number *</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className={errors.mobile ? "error-border" : ""}
              />
              <span className="error-space">{errors.mobile}</span>
            </div>

            <div className="field">
              <label>Aadhaar Number *</label>
              <input
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                className={errors.aadhar ? "error-border" : ""}
              />
              <span className="error-space">{errors.aadhar}</span>
            </div>

            <div className="field">
              <label>Select Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="selectRoleStatus"
              >
                <option value="">-- Select Role --</option>
                {roles.map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <span className="error-space" />
            </div>

            <div className="field">
              <label>Create Password *</label>
              <div className="departmentPassword">
                <input
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? "error-border" : ""}
                />
                <div className={`passwordToggle ${passwordShown ? "visible" : "notVisible"}`} onClick={togglePassword}>
                  <span>{passwordShown ? "Hide" : "Show"}</span>
                </div>
              </div>
              <span className="error-space">{errors.password}</span>
            </div>

            <div className="field full">
              <label>Confirm Password *</label>
              <div className="departmentPassword">
                <input
                  type={confirmPasswordShown ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error-border" : ""}
                />
                <div className={`passwordToggle ${confirmPasswordShown ? "visible" : "notVisible"}`} onClick={toggleConfirmPassword}>
                  <span>{confirmPasswordShown ? "Hide" : "Show"}</span>
                </div>
              </div>
              <span className="error-space">{errors.confirmPassword}</span>
            </div>
          </div>

          <button className="reg-btn" onClick={doRegister}>
            Register
          </button>

          <p className="back-login">
            You have account already? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

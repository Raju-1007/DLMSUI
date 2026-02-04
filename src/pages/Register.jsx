import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext"; 


export default function Register() {
  const { showSuccess, showError } = useMessage();
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [adhaarValue, setAdhaarValue] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    // loadRoles();
  }, []);

  // const loadRoles = async () => {
  //   try {
  //     const res = await axios.get(
  //       import.meta.env.VITE_API_BASE_URL + "/api/roles/getRoles"
  //     );
  //     const filtered = res.data.filter(
  //       (r) => r !== "SUPER_ADMIN" && r !== "TEACHER" && r !== "ADMIN"
  //     );
  //     setRoles(filtered);
  //   } catch(err) {
  //      showError("Error loading roles:", err);
  //   }
  // };
   
  /* ================= VALIDATIONS ================= */

  const nameRegex = /^[A-Za-z ]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;
  const aadhaarRegex = /^[0-9]{12}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/;

  const doRegister = async () => {
    if (!fullName.trim()) {
      return showError("Full Name is required");
    }

    if (!nameRegex.test(fullName)) {
      return showError("Full Name must contain only letters and min 3 characters");
    }

    if (!emailRegex.test(email)) {
      return showError("Enter a valid Email address");
    }

    if (!mobileRegex.test(mobile)) {
      return showError("Mobile number must be exactly 10 digits");
    }

    if (!aadhaarRegex.test(adhaarValue)) {
      return showError("Aadhaar number must be exactly 12 digits");
    }

    if (!role) {
      return showError("pleaseselect a role");
    }

    if (!passwordRegex.test(password)) {
      return showError(
        "Password must be 8–15 chars with uppercase, lowercase, number & special character"
      );
    }

    if (password !== confirmPassword) {
      return showError("Password and Confirm Password do not match");
    }

    try {
      const result = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/login/addloginData",
        {
          role,
          password,
          email,
          fullName,
          mobile,
          adhaarValue,
          confirmPassword,
        }
      );

      if (result && result.data) {
         localStorage.setItem("studentsInformation",JSON.stringify(result.data));
        showSuccess("Registered successfully!");
        nav("/");
      }
    } catch(err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="reg-page-container">
      <div className="reg-form-box">
        <h1 className="reg-title">Student Register Account</h1>

        <label>Full Name<span className="req">*</span></label>
        <input
          type="text"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>Email<span className="req">*</span></label>
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Mobile Number<span className="req">*</span></label>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          maxLength={10}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ""))
          }
        />

        <label>Aadhaar Number<span className="req">*</span></label>
        <input
          type="text"
          placeholder="Enter Aadhaar Number"
          value={adhaarValue}
          maxLength={12}
          onChange={(e) =>
            setAdhaarValue(e.target.value.replace(/\D/g, ""))
          }
        />

        <label>Role<span className="req">*</span></label>
<input
  className="SelectRoleRegister"
  type="text"
  value="STUDENT"
  readOnly
/>

        <label>Enter Password<span className="req">*</span></label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password<span className="req">*</span></label>
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="reg-submit-btn" onClick={doRegister}>
          Register
        </button>

        <p style={{ textAlign: "center" }}>
          You have an account already? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

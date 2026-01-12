// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginUserThunk } from "../redux/authSlice";
// import { loginMock } from "../lib/auth";
// import { useMessage } from "../context/MessageContext";

// export default function Login() {
//   const nav = useNavigate();
//    const { showSuccess, showError } = useMessage();
//   const dispatch = useDispatch();

//   const [roles, setRoles] = useState([]);
//   const [role, setRole] = useState("");
//   const [adhaarValue, setAdhaarValue] = useState("");
//   const [roleId, setRoleId] = useState("");
//   const [password, setPassword] = useState("");

//   const [captchaValue, setCaptchaValue] = useState("");
//   const [captchaId, setCaptchaId] = useState("");
//   const [captchaInput, setCaptchaInput] = useState("");
//    const [selectedOption, setSelectedOption] = useState(false)  

//   // Forgot password
//   const [showForgot, setShowForgot] = useState(false);
//   const [fpAadhar, setFpAadhar] = useState("");
//   const [fpPassword, setFpPassword] = useState("");
//   const [fpConfirmPassword, setFpConfirmPassword] = useState("");

//   useEffect(() => {
//     loadRoles();
//     loadCaptcha();
//   }, []);

//   const loadRoles = async () => {
//     const res = await axios.get(
//       import.meta.env.VITE_API_BASE_URL + "/api/roles/getRoles"
//     );
//     setRoles(res.data);
//   };

//   const loadCaptcha = async () => {
//     const res = await axios.get(
//       import.meta.env.VITE_API_BASE_URL + "/api/roles/generate"
//     );
//     setCaptchaValue(res.data.captchaValue);
//     setCaptchaId(res.data.captchaId);
//   };

//   const getRoleId = async (value) => {
//     if (value.length === 12) {
//       try {
//         const res = await axios.get(
//           import.meta.env.VITE_API_BASE_URL +
//             `/api/roles/getRoleByAadhar/${value}`
//         );
//         setRoleId(res.data.loginid || "");
//       } catch {
//         setRoleId("");
//       }
//     } else {
//       setRoleId("");
//     }
//   };

//   /* ================= LOGIN VALIDATION ================= */
//   const doLogin = () => {
//     if (!role) {
//       showError("Please select role");
//       return;
//     }

//     if (!/^\d{12}$/.test(adhaarValue)) {
//       showError("Aadhaar number must be exactly 12 digits");
//       return;
//     }

//     if (!roleId) {
//       showError("Login ID not generated");
//       return;
//     }

//     if (!password) {
//       showError("Please enter password");
//       return;
//     }

//     if (!/^\d{4}$/.test(captchaInput)) {
//       showError("Captcha must be exactly 4 digits");
//       return;
//     }

//     dispatch(
//       loginUserThunk({
//         role,
//         password,
//         captchaId,
//         captchaInput,
//         adhaarValue,
//       })
//     )
//       .unwrap()
//       .then((res) => {
//         loginMock(role);
//         if (res.role === "ADMIN") nav("/admin/dashboard");
//         else if (res.role === "STUDENT") nav("/dashboard");
//         else if (res.role === "SUPER_ADMIN")
//           nav("/SuperAdminDashboard");
//         else nav("/teacher/dashboard");
//       })
//       .catch(() => showError("Login failed"));
//   };

//   /* ================= FORGOT PASSWORD VALIDATION ================= */
//   const handleForgotSubmit = async () => {
//     if (!/^\d{12}$/.test(fpAadhar)) {
//       showError("Aadhaar number must be exactly 12 digits");
//       return;
//     }

//     if (!fpPassword) {
//       showError("Please enter new password");
//       return;
//     }

//     if (fpPassword !== fpConfirmPassword) {
//       showError("Password and Confirm Password do not match");
//       return;
//     }

//     if (!/^\d{4}$/.test(captchaInput)) {
//       showError("Captcha must be exactly 4 digits");
//       return;
//     }

//     await axios.post(
//       import.meta.env.VITE_API_BASE_URL + "/api/roles/forgot-password",
//       {
//         aadhar: fpAadhar,
//         newPassword: fpPassword,
//         confirmPassword: fpConfirmPassword,
//         captchaId,
//         captchaInput,
//       }
//     );

//     showSuccess("Password updated successfully");
//     setShowForgot(false);
//   };

//   function onValueChange(event){
//         // Updating the state with the selected radio button's value
//         setSelectedOption(true)
//     }
//    function onValueDepartmnetChange(event){
//           setSelectedOption(true)
//    }

//   return (
//     <div className="page-container">
//       <div className="login-card">
//         <h2 className="title">Login to Your Account</h2>
//         <label>
//           <input
//             type="radio"
//             value="Blue"
//             // Checking this radio button if the selected option is "Blue"
          
//             onChange={onValueChange}/>
//           student login
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="Blue"
//             // Checking this radio button if the selected option is "Blue"
          
//             onChange={onValueDepartmnetChange}/>
//           departmnetLogin
//         </label>
//         <label>Select Role<span className="req">*</span></label>
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="">Select Role</option>
//           {roles.map((r, i) => (
//             <option key={i} value={r}>{r}</option>
//           ))}
//         </select>

//         <label>Enter Aadhaar number<span className="req">*</span></label>
//         <input
//           maxLength={12}
//           value={adhaarValue}
//           placeholder="Enter Aadhaar Number"
//           onChange={(e) => {
//             const v = e.target.value.replace(/\D/g, "");
//             setAdhaarValue(v);
//             getRoleId(v);
//           }}
//         />

//         <label>Automatically get Login Id<span className="req">*</span></label>
//         <input value={roleId} readOnly placeholder="Your Login ID" />

//         <label>Enter Password<span className="req">*</span></label>
//         <input
//           type="password"
//           value={password}
//           placeholder="Enter Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <p className="forgot-link" onClick={() => setShowForgot(true)}>
//           Forgot ID or Password?
//         </p>

//         <label>Enter Captcha<span className="req">*</span></label>
//         <input
//           className="captchainput"
//           maxLength={4}
//           value={captchaInput}
//           placeholder="Enter Captcha"
//           onChange={(e) =>
//             setCaptchaInput(e.target.value.replace(/\D/g, ""))
//           }
//         />

//         <div className="captcha-row">
//           <div className="captcha-box">
//             {captchaValue.split("").map((c, i) => (
//               <span key={i} className="captcha-char">{c}</span>
//             ))}
//           </div>
//           <button className="captcha-refresh-btn" onClick={loadCaptcha}>
//             ↻
//           </button>
//         </div>

//         <button className="login-btn" onClick={doLogin}>
//           Login
//         </button>

//         <p>Student? <a href="/register">Register</a></p>
//         <p>Department? <a href="/departmentLogin">Register</a></p>
//       </div>

//       {/* ================= FORGOT PASSWORD ================= */}
//       {showForgot && (
//         <div className="modal-overlay" onClick={() => setShowForgot(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Forgot Password</h2>

//             <label>Enter Aadhaar Number<span className="req">*</span></label>
//             <input
//             placeholder="Enter  AdhaarNumber"
//               maxLength={12}
//               value={fpAadhar}
//               onChange={(e) =>
//                 setFpAadhar(e.target.value.replace(/\D/g, ""))
//               }
//             />

//             <label>Enter New Password<span className="req">*</span></label>
//             <input
//             placeholder="Enter  Password"
//               type="password"
//               value={fpPassword}
//               onChange={(e) => setFpPassword(e.target.value)}
//             />

//             <label>Confirm Password<span className="req">*</span></label>
//             <input
//               placeholder="Enter  password"
//               type="password"
//               value={fpConfirmPassword}
//               onChange={(e) => setFpConfirmPassword(e.target.value)}
//             />

//             <label>Enter Captcha<span className="req">*</span></label>
//             <input
//             placeholder="Enter Captcha"
//               maxLength={4}
//               value={captchaInput}
//               onChange={(e) =>
//                 setCaptchaInput(e.target.value.replace(/\D/g, ""))
//               }
//             />

//             <div className="captcha-row">
//               <div className="captcha-boxx">{captchaValue}</div>
//               <button
//                 className="captcha-refresh-btnforgot"
//                 onClick={loadCaptcha}
//               >
//                 ↻
//               </button>
//             </div>

//             <button className="login-btn" onClick={handleForgotSubmit}>
//               Submit
//             </button>

//             <p className="back-login" onClick={() => setShowForgot(false)}>
//               Back to Login
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserThunk } from "../redux/authSlice";
import { loginMock } from "../lib/auth";
import { useMessage } from "../context/MessageContext";

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
  const[departmentId,setDepartmentId]=useState("");
 

  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  /* ================= FORGOT ================= */
  const [showForgot, setShowForgot] = useState(false);
  const [fpAadhar, setFpAadhar] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    loadCaptcha();
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/api/roles/getRoles"
    );
    setRoles(res.data.filter(r =>  r !== "STUDENT"));
    
  };

  const loadCaptcha = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/api/roles/generate"
    );
    setCaptchaValue(res.data.captchaValue);
    setCaptchaId(res.data.captchaId);
  };

 

  /* ================= LOGIN ================= */
  const doLogin = () => {
    if (!password) return showError("Password required");

    // STUDENT LOGIN
    if (loginType === "student") {
      if (!studentId) return showError("Student ID required");

      dispatch(
        loginUserThunk({
          role: "STUDENT",
          password,
          loginid: studentId,
          captchaId,
          captchaInput,
        })
      )
        .unwrap()
        .then((res) => {
          showSuccess(res.message);
          loginMock("STUDENT");
          nav("/dashboard");
        })
        .catch(() => 
          
          showError("Login failed"),
          showError(err));
    }

    // DEPARTMENT LOGIN
    if (loginType === "department") {
      if (!role) return showError("Select role");
      // if (!/^\d{12}$/.test(adhaarValue))
      //   return showError("Aadhaar must be 12 digits");
      if (!departmentId) return showError("Login ID not generated");
      if (!/^\d{4}$/.test(captchaInput))
        return showError("Captcha must be 4 digits");

      dispatch(
        loginUserThunk({
          role,
          loginid:departmentId,
          password,
          captchaId,
          captchaInput,
        
        })
      )
        .unwrap()
        .then((res) => {
          loginMock(role);
          if (res.role === "ADMIN") nav("/admin/dashboard");
          else if (res.role === "SUPER_ADMIN")
            nav("/SuperAdminDashboard");
          else nav("/teacher/dashboard");
        })
        .catch(() => 
          
         showError("Login failed"),
          showError(err));
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
      import.meta.env.VITE_API_BASE_URL + "/api/roles/forgot-password",
      {
        aadhar: fpAadhar,
        newPassword: fpPassword,
        confirmPassword: fpConfirmPassword,
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
        <h2 className="title">DLMS LOGIN</h2>
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
            <input
              className="captchainput"
              maxLength={4}
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(e.target.value.replace(/\D/g, ""))
              }
            />
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

           

             <label>Student ID *</label>
            <input
              placeholder="Enter Teacher/Department ID"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            />


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
            <input
              className="captchainput"
              maxLength={4}
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(e.target.value.replace(/\D/g, ""))
              }
            />
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
             <button className="login-btn" onClick={doLogin}>
          Login
        </button>
            <p style={{ textAlign: "center" }}>
          You dont have an account? <a href="/departmentLogin">register</a>
        </p>
      
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

            <label>New Password *</label>
            <input
               placeholder="Enter password"
              type="password"
              value={fpPassword}
              onChange={(e) => setFpPassword(e.target.value)}
            />

            <label>Confirm Password *</label>
            <input
               placeholder="Enter confirmAadhaarNumber"
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


// import React from 'react'
// import { Link } from 'react-router-dom'
// import { logout, role } from '../lib/auth'
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//     const nav = useNavigate();
//     const  doLogout=()=>{
//         const result= logout();
//         if(result){
//          nav("/");
//          }

//     }
//     return (

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 20 }}>
//             <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Link to='/dashboard' style={{ fontWeight: 700, textDecoration: 'none', color: '#111' }}>DLMS</Link>
//             {/* <Link to='/courses'>Courses</Link><Link to='/progress'>Progress</Link> */}
//                 {role() === 'TEACHER' && <Link to='/teacher/dashboard'>Teacher</Link>}
//                 {role() === 'ADMIN' && <Link to='/admin/dashboard'>Admin</Link>}</div>
//             <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Link to='/notifications'>🔔</Link><Link to='/help'>💬</Link>
//                 <button className='btn' onClick={doLogout}>Logout</button></div></div>)
// }


import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { logout, role } from '../lib/auth'
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { http } from '../api/axios';
import { useSelector } from 'react-redux';
import axios from 'axios';


export default function Navbar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const userRole = role();
  const login=useSelector((state)=>state.auth.user);


  const fallbackNotifications = [
    {
      title: "You have scheduled a timeline for Mathematics",
      body: "revision from 27/11/2025 - 6:00 pm to 8:00 pm"
    },
    {
      title: "You have scheduled a timeline for Science",
      body: "revision from 27/11/2025 - 9:00 pm to 10:00 pm"
    },
    {
      title: "You have scheduled a timeline for Social",
      body: "revision from 27/11/2025 - 8:00 pm to 9:00 pm"
    }
  ];



  // Fetch notifications
  useEffect(() => {
    http.get('/notify/inbox/1')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems(fallbackNotifications);
        }
      })
      .catch(() => {
        setItems(fallbackNotifications);
      });
  }, []);

  const doLogout = () => {
    const result = logout();
    if (result) {
      HandileLogoutActivity();
      nav("/");
    }
  };

  const HandileLogoutActivity=async()=>{
        try{
             await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/roles/logout", {loginId: login.loginId, adhaar: login.Adhaar});
        }
        catch(err){
            console.error(err);
        }
  }

  //   React.useEffect(() => {
  //   if (showPopup) {
  //     fetchNotifications();
  //   }
  // }, [showPopup]);

const handleViewProfile = () => {
  if (userRole === "STUDENT") {
    nav("/student-profile");
  } 
  else if (userRole === "TEACHER") {
    nav("/teacherProfile");
  } 
  else if (userRole === "ADMIN") {
    nav("/adminProfile");
  } 
  else if (userRole === "SUPER_ADMIN") {
    nav("/superAdminLoginActivity");
  }
};

const navigateLoginActivity=()=>{
   if (userRole === "STUDENT") {
    // nav("/studentloginActivity");
  } 
  else if (userRole === "TEACHER") {
     nav("/teacherLoginActivity");
  } 
  else if (userRole === "ADMIN") {
    nav("/adminLoginActivity");
  } 
  else if (userRole === "SUPER_ADMIN") {
    nav("/superAdminloginActivity");
  }

};



  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      {/* LEFT SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* LOGO */}
        {/* <Link to="/dashboard"> */}
        <img
          src="/images/cr_logo.png"
          alt="CR Logo"
          style={{
            height: 30,  // adjust for perfect size
            objectFit: "contain",
            cursor: "pointer",
            marginLeft: 5
          }}
        />
        {/* </Link> */}

        {/* Optional: remove or keep DLMS text */}
        <div className="dlms-title-wrapper">
          <div className="dlms-title">DLMS</div>
          <div className="dlms-subtitle">(Digital Learning Management System)</div>
        </div>

        {/* {role() === 'TEACHER' && (
          <Link to='/teacher/dashboard' style={{ marginLeft: 14 }}>
            Teacher
          </Link>
        )}
        {role() === 'ADMIN' && (
          <Link to='/admin/dashboard' style={{ marginLeft: 14 }}>
            Admin
          </Link>
        )} */}

      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: 'flex', gap: 15, alignItems: 'center',paddingRight:'40px' }}>
        {/* <Link to='/notifications' style={{ fontSize: 20 }}>🔔</Link> */}
        <span
          style={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => setShowPopup(true)}
        >
          🔔
        </span>

        {/* <Link to='/help' style={{ fontSize: 20 }}>💬</Link> */}


        {/* PROFILE BUTTON + DROPDOWN */}
        <div style={{ position: "relative" }}>

          {/* Focusable button for onBlur */}
          <div
            tabIndex={0}
            onClick={() => setOpen(!open)}
            onBlur={() => setOpen(false)}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#0ea5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 22,
              cursor: "pointer",
              outline: "none"
            }}
            title="Profile"
          >
            <FaUserCircle />
          </div>

          {/* DROPDOWN PANEL */}
          {open && (
            <div
              onMouseDown={(e) => e.preventDefault()} // prevent closing when clicking inside
              style={{
                position: "absolute",
                top: 52,
                right: 0,
                width: 260,
                background: "#fff",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(2,6,23,0.12)",
                zIndex: 9999
              }}
            >
              {/* HEADER SECTION */}
              <div
                style={{
                  padding: 16,
                  background: "#f7fafc",
                  borderBottom: "1px solid #e6eef7"
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#0ea5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    marginBottom: 8
                  }}
                >
                  {userRole[0]}
                </div>

                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  {userRole === "STUDENT" ? "Student User" :
                    userRole === "TEACHER" ? "Teacher User" :
                      "Admin User"}
                </div>

                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {userRole.toLowerCase()}@dlms.com
                </div>
              </div>

              {/* MENU SECTION */}
              <div style={{ padding: 8 }}>
                <MenuItem
  icon={<FaUser />}
  text="View Profile"
  onClick={handleViewProfile}
/>

                {/* <MenuItem icon={<FaCog />} text="Account Setting" /> */}
  <MenuItem
  icon={<FaHistory />}
  text="Login Activity"
  onClick={navigateLoginActivity}
/>

              </div>

              {/* LOGOUT SECTION */}
              <div style={{ borderTop: "1px solid #eaeef3" }}>
                <MenuItem
                  icon={<FaSignOutAlt />}
                  text="Sign out"
                  onClick={doLogout}
                />
              </div>

            </div>
          )}
        </div>
        {showPopup && (
          <div className="notify-overlay" onClick={() => setShowPopup(false)}>

            <div className="notify-popup" onClick={(e) => e.stopPropagation()}>

              {/* HEADER */}
              <div className="notify-popup-header">
                <h3>Notifications</h3>
                <span className="notify-close-btn" onClick={() => setShowPopup(false)}>
                  ✖
                </span>
              </div>

              {/* CONTENT */}
              <div className="notify-popup-content">
                {items.map((item, index) => (
                  <div key={index} className="notify-card">

                    {/* Color Icon */}
                    <div
                      className="notify-icon"
                      style={{
                        background:
                          index === 0 ? "#6C63FF" :
                            index === 1 ? "#00C8FF" :
                              "#FF9800"
                      }}
                    />

                    {/* Text */}
                    <div className="notify-text">
                      <p className="notify-title">{item.title}</p>
                      <p className="notify-body">{item.body}</p>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}


      </div>
    </div>
  );
}

/* REUSABLE MENU ITEM */
function MenuItem({ icon, text, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 14
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f6fb")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import {
  FaUserCog,
  FaShieldAlt,
  FaSchool,
  FaBell,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";


export default function AdminSettings() {

  const login = useSelector((state) => state.auth.user);

  const [previewImage, setPreviewImage] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const [system, setSystem] = useState({
    school: "DLMS International School",
    year: "2025-2026",
    timings: "09:00 AM - 04:00 PM",
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });

  useEffect(() => {
    if (login?.userDetails) {
      setAdmin(login.userDetails);
      loadProfileImage();
    }
  }, [login]);

  const loadProfileImage = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          "/login/getTeacherProfileImage",
        {
          params: {
            teacherId: login?.userDetails?.loginid,
            role: login?.userDetails?.role,
          },
        }
      );

      if (res.data) {
        setPreviewImage(`data:image/jpeg;base64,${res.data}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!admin) return null;

  return (
    <div className="admin-settings-page">
      <Navbar />

      <div className="settings-layout">
        <Sidebar />

        <div className="settings-main">

          <h2 className="settings-title">Admin Settings</h2>

          {/* PROFILE */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaUserCog className="icon" /> Profile Settings
            </h3>

            <div className="admin-avatar-box">
              {previewImage ? (
                <img src={previewImage} className="admin-avatar" alt="Admin" />
              ) : (
                <div className="admin-avatar-placeholder">
                  {admin?.fullName?.charAt(0)}
                </div>
              )}
            </div>

            <label>Name</label>
            <input
              value={admin?.fullName || ""}
              onChange={(e) =>
                setAdmin({ ...admin, fullName: e.target.value })
              }
            />

            <label>Email</label>
            <input
              value={admin?.email || ""}
              onChange={(e) =>
                setAdmin({ ...admin, email: e.target.value })
              }
            />

            <label>Phone</label>
            <input
              value={admin?.mobile || ""}
              onChange={(e) =>
                setAdmin({ ...admin, mobile: e.target.value })
              }
            />

            <button className="btn-primary">Change Password</button>
          </section>

          {/* SECURITY */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaShieldAlt className="icon" /> Security Settings
            </h3>

            <div className="toggle-row">
              <span>Enable 2-Factor Authentication</span>
              <input type="checkbox" />
            </div>
          </section>

          {/* SYSTEM */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaSchool className="icon" /> System Settings
            </h3>

            <label>School Name</label>
            <input
              value={system.school}
              onChange={(e) =>
                setSystem({ ...system, school: e.target.value })
              }
            />

            <label>Academic Year</label>
            <input
              value={system.year}
              onChange={(e) =>
                setSystem({ ...system, year: e.target.value })
              }
            />

            <label>Class Timings</label>
            <input
              value={system.timings}
              onChange={(e) =>
                setSystem({ ...system, timings: e.target.value })
              }
            />
          </section>

          {/* NOTIFICATIONS */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaBell className="icon" /> Notification Settings
            </h3>

            {Object.keys(notifications).map((key) => (
              <div className="toggle-row" key={key}>
                <span>{key.toUpperCase()} Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                />
              </div>
            ))}
          </section>

          {/* DANGER ZONE */}
          <section className="danger-section">
            <h3 className="section-title danger-title">
              <FaExclamationTriangle className="icon" /> Danger Zone
            </h3>

            <div className="danger-buttons">
              <button className="btn-danger">Clear Cache</button>
              <button className="btn-warning">Logout</button>
              <button className="btn-delete">Delete Account</button>
            </div>
          </section>

          <button className="save-btn">
            <FaCheck className="icon" /> Save All Settings
          </button>

          <Footer />
        </div>
      </div>
    </div>
  );
}
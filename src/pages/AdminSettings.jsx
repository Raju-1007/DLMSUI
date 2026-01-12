import React, { useState } from "react";
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
import { useMessage } from "../context/MessageContext"; 
export default function AdminSettings() {
  const { showSuccess, showError } = useMessage();

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@dlms.com",
    phone: "9876543210",
  });

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

  return (
    <div className="admin-settings-page">
      <Navbar />

      <div className="settings-layout">
        <Sidebar />

        <div className="settings-main">

          <h2 className="settings-title">Admin Settings</h2>

          {/* -------------------- PROFILE -------------------- */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaUserCog className="icon" /> Profile Settings
            </h3>

            <div className="profile-photo-row">
              <img
                src="/images/admin.png"
                alt="Admin"
                className="profile-photo"
              />
              <button className="btn-secondary">Change Photo</button>
            </div>

            <label>Name</label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <label>Email</label>
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <label>Phone</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <button className="btn-primary">Change Password</button>
          </section>

          {/* -------------------- SECURITY -------------------- */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaShieldAlt className="icon" /> Security Settings
            </h3>

            <div className="toggle-row">
              <span>Enable 2-Factor Authentication</span>
              <input type="checkbox" />
            </div>

            <div className="toggle-row">
              <span>Enable Login showErrors</span>
              <input type="checkbox" defaultChecked />
            </div>
          </section>

          {/* -------------------- SYSTEM -------------------- */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaSchool className="icon" /> System Settings
            </h3>

            <label>School / Institute Name</label>
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

            <label>Default Class Timings</label>
            <input
              value={system.timings}
              onChange={(e) =>
                setSystem({ ...system, timings: e.target.value })
              }
            />
          </section>

          {/* -------------------- NOTIFICATIONS -------------------- */}
          <section className="settings-section">
            <h3 className="section-title">
              <FaBell className="icon" /> Notification Settings
            </h3>

            <div className="toggle-row">
              <span>Allow Push Notifications</span>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
              />
            </div>

            <div className="toggle-row">
              <span>Email showErrors</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
              />
            </div>

            <div className="toggle-row">
              <span>SMS Notifications</span>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
              />
            </div>
          </section>

          {/* -------------------- DANGER ZONE -------------------- */}
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

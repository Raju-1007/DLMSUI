// src/pages/AdminProfile.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

export default function AdminProfile() {

  const login = useSelector((state) => state.auth.user);
  const adminId = login?.userDetails?.loginid;

  const [admin, setAdmin] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (adminId) {
      setAdmin(login?.userDetails);
      loadProfileImage();
      loadDashboard();
    }
  }, [adminId]);

  /* ================= DASHBOARD ================= */

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/analytics/getSuperAdminDashBoardDetails"
      );
      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderGrowth = (value) => {
    if (value > 0)
      return <span className="growth-badge growth-positive">▲ {value}%</span>;

    if (value < 0)
      return (
        <span className="growth-badge growth-negative">
          ▼ {Math.abs(value)}%
        </span>
      );

    return <span className="growth-badge growth-neutral">0%</span>;
  };

  /* ================= PROFILE IMAGE ================= */

  const loadProfileImage = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          "/login/getTeacherProfileImage",
        {
          params: {
            teacherId: adminId,
            role: login?.userDetails?.role
          }
        }
      );

      if (res.data) {
        setPreviewImage(`data:image/jpeg;base64,${res.data}`);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("teacherId", adminId);
    formData.append("file", file);
    formData.append("role", login?.userDetails?.role);

    try {
      await axios.post(
        import.meta.env.VITE_API_BASE_URL +
          "/login/uploadTeacherProfileImage",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      loadProfileImage();
    } catch {
      alert("Upload failed");
    }
  };

  const handleRemoveImage = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL +
          "/login/removeTeacherProfileImage",
        {
          params: {
            teacherId: adminId,
            role: login?.userDetails?.role
          }
        }
      );
      setPreviewImage(null);
    } catch {
      alert("Remove failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">

          {/* PROFILE CARD */}
          <div className="admin-card">
            <div className="admin-profile">

              <div className="admin-avatar-box">
                {previewImage ? (
                  <img src={previewImage} className="admin-avatar" alt="Admin" />
                ) : (
                  <div className="admin-avatar-placeholder">
                    {admin?.fullName?.charAt(0)}
                  </div>
                )}

                <label className="admin-change-btn">
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {previewImage && (
                  <button
                    className="admin-remove-btn"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="admin-info">
                <h2>{admin?.fullName}</h2>

                <div className="admin-info-grid">
                  <p><b>Admin ID:</b> {admin?.loginid}</p>
                  <p><b>Role:</b> {admin?.role}</p>
                  <p><b>Email:</b> {admin?.email}</p>
                  <p><b>Phone:</b> {admin?.mobile}</p>
                  <p><b>Status:</b> <span className="status-active">Active</span></p>
                </div>
              </div>

            </div>
          </div>

          {/* DASHBOARD STATS */}
          <div className="admin-card">
            <h3>Academic Management Summary</h3>

            <div className="admin-stats-grid">

              <div className="stat-box">
                <h4>Students</h4>
                <p>{dashboard?.studentCount ?? 0}</p>
                {dashboard && renderGrowth(dashboard.growth.students)}
              </div>

              <div className="stat-box">
                <h4>Teachers</h4>
                <p>{dashboard?.teachers ?? 0}</p>
                {dashboard && renderGrowth(dashboard.growth.teachers)}
              </div>

              <div className="stat-box">
                <h4>Schools</h4>
                <p>{dashboard?.schools ?? 0}</p>
                {dashboard && renderGrowth(dashboard.growth.schools)}
              </div>

              <div className="stat-box">
                <h4>Mandals</h4>
                <p>{dashboard?.mandals ?? 0}</p>
              </div>

              <div className="stat-box">
                <h4>Villages</h4>
                <p>{dashboard?.villages ?? 0}</p>
              </div>

              <div className="stat-box">
                <h4>Districts</h4>
                <p>{dashboard?.districts ?? 0}</p>
              </div>

            </div>
          </div>

          {/* TEACHERS TABLE */}
          <div className="admin-card">
            <h3>Teachers Overview</h3>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service ID</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Joining Date</th>
                </tr>
              </thead>

              <tbody>
                {dashboard?.teachersList?.map((t, index) => (
                  <tr key={index}>
                    <td>{t.teacher_name}</td>
                    <td>{t.teacher_service_id}</td>
                    <td>{t.teacher_subjects}</td>
                    <td>{t.class_name}</td>
                    <td>{t.teacher_joining_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
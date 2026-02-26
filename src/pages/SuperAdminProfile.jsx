// src/pages/SuperAdminProfile.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

export default function SuperAdminProfile() {

  const login = useSelector((state) => state.auth.user);
  const superAdminId = login?.userDetails?.loginid;

  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (superAdminId) {
      setProfile(login?.userDetails);
      loadProfileImage();
      loadDashboard();
    }
  }, [superAdminId]);

  /* ================= DASHBOARD DATA ================= */

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/getSuperAdminDashBoardDetails`
      );
      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= IMAGE ================= */

  const loadProfileImage = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/getTeacherProfileImage`,
        {
          params: {
            teacherId: superAdminId,
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
    formData.append("teacherId", superAdminId);
    formData.append("file", file);
    formData.append("role", login?.userDetails?.role);

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/login/uploadTeacherProfileImage`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    loadProfileImage();
  };

  const handleRemoveImage = async () => {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/login/removeTeacherProfileImage`,
      {
        params: {
          teacherId: superAdminId,
          role: login?.userDetails?.role
        }
      }
    );
    setPreviewImage(null);
  };

  return (
    <>
      <Navbar />

      <div className="sap-layout">
        <Sidebar />

        <div className="sap-main">

          {/* PROFILE CARD */}
          <div className="sap-card">

            <div className="sap-profile">

              <div className="sap-avatar-box">

                {previewImage ? (
                  <img src={previewImage} className="sap-avatar" />
                ) : (
                  <div className="sap-avatar-placeholder">
                    {profile?.fullName?.charAt(0)}
                  </div>
                )}

                <label className="sap-change-btn">
                  Change Photo
                  <input type="file" hidden accept="image/*"
                    onChange={handleImageUpload}/>
                </label>

                {previewImage && (
                  <button className="sap-remove-btn"
                    onClick={handleRemoveImage}>
                    Remove
                  </button>
                )}

              </div>

              <div className="sap-info">
                <h2>{profile?.fullName}</h2>

                <div className="sap-info-grid">
                  <p><b>Super Admin ID:</b> {profile?.loginid}</p>
                  <p><b>Role:</b> {profile?.role}</p>
                  <p><b>Email:</b> {profile?.email}</p>
                  <p><b>Phone:</b> {profile?.mobile}</p>
                  <p><b>Status:</b> <span className="sap-status">Active</span></p>
                </div>
              </div>

            </div>

          </div>

          {/* OVERVIEW SUMMARY */}
          <div className="sap-card">
            <h3>System Overview</h3>

            <div className="sap-stats">

              <StatBox label="States" value={dashboard?.states} />
              <StatBox label="Districts" value={dashboard?.districts} />
              <StatBox label="Mandals" value={dashboard?.mandals} />
              <StatBox label="Villages" value={dashboard?.villages} />
              <StatBox label="Schools" value={dashboard?.schools} />
              <StatBox label="Teachers" value={dashboard?.teachers} />
              <StatBox label="Students" value={dashboard?.studentCount} />

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="sap-stat-box">
      <p>{label}</p>
      <h2>{value ?? 0}</h2>
    </div>
  );
}
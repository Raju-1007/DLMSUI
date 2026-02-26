// src/pages/TeacherProfile.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

export default function TeacherProfile() {

  const login = useSelector((state) => state.auth.user);
  const teacherId = login?.userDetails?.loginid;

  const [teacher, setTeacher] = useState(null);
  const [extraDetails, setExtraDetails] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BASIC PROFILE ================= */

  useEffect(() => {
    if (teacherId) {
      loadTeacher();
    }
  }, [teacherId]);

  const loadTeacher = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        `/login/getTeacherUpdateProfileDetails/${teacherId}`
      );

      const teacherData = res.data[0];
      setTeacher(teacherData);

      if (teacherData?.profileImage) {
        setPreviewImage(
          `data:image/jpeg;base64,${teacherData.profileImage}`
        );
      }

      // Load additional details using serviceId
      if (teacherData?.techerServiceId) {
        loadExtraDetails(teacherData.techerServiceId);
      }

    } catch (err) {
      console.log(err);
      setTeacher(null);
    }
  };

  const loadExtraDetails = async (serviceId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/teacherByServiceId/${serviceId}`
      );

      setExtraDetails(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("teacherId", teacherId);
    formData.append("file", file);

    try {
      setLoading(true);

      await axios.post(
        import.meta.env.VITE_API_BASE_URL +
        `/login/uploadTeacherProfileImage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      loadTeacher();

    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE IMAGE ================= */

  const handleRemoveImage = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL +
        `/login/removeTeacherProfileImage`,
        { params: { teacherId } }
      );

      setPreviewImage(null);

    } catch {
      alert("Remove failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <Navbar />

      <div className="tp-layout">
        <Sidebar />

        <div className="tp-main">

          <div className="tp-card">

            <div className="tp-header">

              {/* PROFILE IMAGE */}
              <div className="tp-avatar-container">

                {previewImage ? (
                  <img src={previewImage} className="tp-avatar" alt="profile" />
                ) : (
                  <div className="tp-avatar-placeholder">
                    {teacher?.teacherName?.charAt(0)}
                  </div>
                )}

                <label className="tp-change-btn">
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {previewImage && (
                  <button className="tp-remove-btn" onClick={handleRemoveImage}>
                    Remove
                  </button>
                )}

              </div>

              {/* PROFILE INFO */}
              <div className="tp-details">
                <h2>{teacher?.teacherName}</h2>

                <div className="tp-info-grid">
                  <p><b>Teacher ID:</b> {teacher?.teacherId}</p>
                  <p><b>Service ID:</b> {teacher?.techerServiceId}</p>
                  <p><b>Email:</b> {teacher?.teacherEmail}</p>
                  <p><b>Phone:</b> {teacher?.teacherPhone}</p>
                  <p><b>Department:</b> {extraDetails?.teacher_department}</p>
                  <p><b>Experience:</b> 3 Years</p>
                  <p><b>Joining Date:</b> {extraDetails?.joining_date}</p>
                  <p><b>Rating:</b> ⭐ {extraDetails?.rating}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
